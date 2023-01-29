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
  pixelRatio: number;
  intialFocus: Box;
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

export function Viewport({ pixelRatio, intialFocus, children }: ViewportProps) {
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
    if (divRef.current === null) return;

    const rect = divRef.current.getBoundingClientRect();

    const scaleFactor =
      pixelRatio / Math.max(intialFocus.size.x, intialFocus.size.y);

    const newPos = scaleTranslation(
      -rect.width * (intialFocus.offset.x / pixelRatio),
      -rect.height * (intialFocus.offset.y / pixelRatio),
      rect.width / 2,
      rect.height / 2,
      scaleFactor
    );

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
          transformOrigin: "0 0",
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale}) `,
        }}
      >
        {children}
      </div>
    </div>
  );
}
