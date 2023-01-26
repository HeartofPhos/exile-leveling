import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export function Viewport({ children }: React.PropsWithChildren) {
  const divRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [inputActive, setInputActive] = useState(false);

  useEffect(() => {
    if (divRef.current === null) return;
    divRef.current.addEventListener("pointerdown", (evt) =>
      evt.preventDefault()
    );
    divRef.current.addEventListener("wheel", (evt) => evt.preventDefault());
    divRef.current.addEventListener("drag", (evt) => evt.preventDefault());
  }, [divRef]);

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
      onPointerMove={(evt) => {
        if (evt.pointerType === "mouse" && (evt.buttons & 1) !== 1) return;

        setPos({
          x: pos.x + evt.movementX,
          y: pos.y + evt.movementY,
        });
      }}
      onWheelCapture={(evt) => {
        const rect = evt.currentTarget.getBoundingClientRect();

        const pointerX = evt.clientX - rect.left;
        const pointerY = evt.clientY - rect.top;

        const deltaX = pointerX - pos.x;
        const deltaY = pointerY - pos.y;

        let scaleFactor = 0.9;
        if (evt.deltaY < 0) scaleFactor = 1 / scaleFactor;

        setScale(scale * scaleFactor);
        setPos({
          x: pointerX - deltaX * scaleFactor,
          y: pointerY - deltaY * scaleFactor,
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
