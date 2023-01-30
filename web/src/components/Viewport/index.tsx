import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

interface Coord {
  x: number;
  y: number;
}

export interface Box {
  offset: Coord;
  size: Coord;
}

export interface ViewportProps {
  intialFocus: (react: DOMRect) => Box;
  children?: React.ReactNode;
}

function scaleTranslation(
  posX: number,
  posY: number,
  anchorX: number,
  anchorY: number,
  scaleFactor: number
) {
  const deltaX = anchorX - posX;
  const deltaY = anchorY - posY;

  return {
    x: anchorX - deltaX * scaleFactor,
    y: anchorY - deltaY * scaleFactor,
  };
}

interface Rect {
  height: number;
  width: number;
}

function focusBox(viewport: Rect, box: Box) {
  const scaleX = viewport.width / box.size.x;
  const scaleY = viewport.height / box.size.y;
  let scaleFactor = Math.min(scaleX, scaleY);

  const halfRectW = viewport.width / 2;
  const halfRectH = viewport.height / 2;

  const deltaX = halfRectW - box.offset.x;
  const deltaY = halfRectH - box.offset.y;

  const newPos = scaleTranslation(
    deltaX,
    deltaY,
    halfRectW,
    halfRectH,
    scaleFactor
  );

  return {
    scaleFactor,
    newPos,
  };
}

export function Viewport({ intialFocus, children }: ViewportProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [inputActive, setInputActive] = useState(false);

  useEffect(() => {
    if (divRef.current === null) return;
    const preventDefault = (evt: Event) => evt.preventDefault();

    divRef.current.addEventListener("pointerdown", preventDefault);
    divRef.current.addEventListener("wheel", preventDefault);
    divRef.current.addEventListener("drag", preventDefault);

    return () => {
      if (divRef.current === null) return;
      divRef.current.removeEventListener("pointerdown", preventDefault);
      divRef.current.removeEventListener("wheel", preventDefault);
      divRef.current.removeEventListener("drag", preventDefault);
    };
  }, [divRef]);

  useEffect(() => {
    // TODO Revisit with some more sanity
    if (divRef.current === null) return;

    // TODO handle rect resize
    const rect = divRef.current.getBoundingClientRect();

    const { scaleFactor, newPos } = focusBox(rect, intialFocus(rect));

    setScale(scaleFactor);
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

        setPos({
          x: pos.x + evt.movementX,
          y: pos.y + evt.movementY,
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
          width: "100%",
          height: "100%",
          transformOrigin: "0 0",
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale}) `,
        }}
      >
        {children}
      </div>
    </div>
  );
}
