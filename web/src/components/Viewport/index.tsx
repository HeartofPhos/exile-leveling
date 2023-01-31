import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import useResizeObserver, { ObservedSize } from "use-resize-observer";

export interface ViewportProps {
  intialFocus: (rect: Rect) => Rect;
  resizePattern: "clip" | "focus";
  children?: React.ReactNode;
}

function scaleTranslation(
  posX: number,
  posY: number,
  anchorX: number,
  anchorY: number,
  scaleFactor: number
) {
  const deltaX = posX - anchorX;
  const deltaY = posY - anchorY;

  return {
    x: anchorX + deltaX * scaleFactor,
    y: anchorY + deltaY * scaleFactor,
  };
}

interface Rect {
  x: number;
  y: number;
  height: number;
  width: number;
}

function focusRect(viewport: Rect, focus: Rect) {
  const scaleX = viewport.width / focus.width;
  const scaleY = viewport.height / focus.height;
  const newScale = Math.min(scaleX, scaleY);

  const halfRectW = viewport.width / 2;
  const halfRectH = viewport.height / 2;

  const deltaX = halfRectW - focus.x;
  const deltaY = halfRectH - focus.y;

  const newPos = scaleTranslation(
    deltaX,
    deltaY,
    halfRectW,
    halfRectH,
    newScale
  );

  return {
    newScale,
    newPos,
  };
}

export function Viewport({
  intialFocus,
  resizePattern,
  children,
}: ViewportProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [inputActive, setInputActive] = useState(false);
  const [prevSize, setPrevSize] = useState<ObservedSize>({
    width: undefined,
    height: undefined,
  });

  useResizeObserver({
    ref: divRef,
    onResize: (size) => {
      setPrevSize(size);
      if (prevSize.width === undefined || prevSize.height === undefined) return;
      if (size.width === undefined || size.height === undefined) return;

      switch (resizePattern) {
        case "clip":
          {
            const dw = prevSize.width - size.width;
            const dh = prevSize.height - size.height;

            setPos({
              x: pos.x - dw / 2,
              y: pos.y - dh / 2,
            });
          }
          break;
        case "focus":
          {
            const { newScale, newPos } = focusRect(
              { x: 0, y: 0, width: size.width, height: size.height },
              {
                x: (prevSize.width / 2 - pos.x) / scale,
                y: (prevSize.height / 2 - pos.y) / scale,
                width: prevSize.width / scale,
                height: prevSize.height / scale,
              }
            );
            setScale(newScale);
            setPos({
              x: newPos.x,
              y: newPos.y,
            });
          }
          break;
      }
    },
  });

  // Prevent events that interfere with viewport interaction
  useEffect(() => {
    if (divRef.current === null) return;
    const preventDefault = (evt: Event) => evt.preventDefault();

    divRef.current.addEventListener("pointerdown", preventDefault);
    divRef.current.addEventListener("wheel", preventDefault);
    divRef.current.addEventListener("touchmove", preventDefault);

    return () => {
      if (divRef.current === null) return;
      divRef.current.removeEventListener("pointerdown", preventDefault);
      divRef.current.removeEventListener("wheel", preventDefault);
      divRef.current.removeEventListener("touchmove", preventDefault);
    };
  }, [divRef]);

  useEffect(() => {
    if (divRef.current === null) return;

    const rect = divRef.current.getBoundingClientRect();
    const { newScale, newPos } = focusRect(rect, intialFocus(rect));

    setScale(newScale);
    setPos({
      x: newPos.x,
      y: newPos.y,
    });
  }, [intialFocus, divRef]);

  return (
    <div
      ref={divRef}
      className={classNames(styles.viewport)}
      onPointerDown={(evt) => {
        if (!evt.isPrimary) return;
        setInputActive(true);
      }}
      onPointerUp={(evt) => {
        if (!evt.isPrimary) return;
        setInputActive(false);
      }}
      onPointerLeave={(evt) => {
        if (!evt.isPrimary) return;
        setInputActive(false);
      }}
      onPointerMove={(evt) => {
        if (evt.pointerType === "mouse" && (evt.buttons & 5) === 0) return;

        const dir = evt.pointerType === "mouse" ? 1 : -1;
        setPos({
          x: pos.x + evt.movementX * dir,
          y: pos.y + evt.movementY * dir,
        });
      }}
      onWheelCapture={(evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();

        const pointerX = evt.clientX - rect.left;
        const pointerY = evt.clientY - rect.top;

        let scaleFactor = 0.9;
        if (evt.deltaY < 0) scaleFactor = 1 / scaleFactor;

        const newPos = scaleTranslation(
          pos.x,
          pos.y,
          pointerX,
          pointerY,
          scaleFactor
        );

        setScale(scale * scaleFactor);
        setPos({
          x: newPos.x,
          y: newPos.y,
        });
      }}
    >
      <div
        className={classNames(styles.inputArea, {
          [styles.active]: inputActive,
        })}
      />
      <div
        style={{
          position: "absolute",
          transformOrigin: "0 0",
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale}) `,
        }}
      >
        {children}
      </div>
    </div>
  );
}
