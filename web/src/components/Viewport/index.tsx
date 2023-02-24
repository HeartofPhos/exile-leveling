import { useEffect, useMemo, useRef, useState } from "react";
import useResizeObserver, { ObservedSize } from "use-resize-observer";
import * as d3 from "d3";
import styles from "./styles.module.css";
import classNames from "classnames";

export interface ViewportProps {
  intialFocus: Rect;
  resizeHandling: "clip" | "contain";
  className?: string;
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

interface Size {
  height: number;
  width: number;
}

interface Rect extends Size {
  x: number;
  y: number;
}

function focusRect(viewport: Size, focus: Rect) {
  const scaleX = viewport.width / focus.width;
  const scaleY = viewport.height / focus.height;
  const newScale = Math.min(scaleX, scaleY);

  const anchorX = viewport.width * 0.5;
  const anchorY = viewport.height * 0.5;

  const posX = anchorX - (focus.x + focus.width * 0.5);
  const posY = anchorY - (focus.y + focus.height * 0.5);

  const newPos = scaleTranslation(posX, posY, anchorX, anchorY, newScale);

  return {
    newScale,
    newPos,
  };
}

export function Viewport({
  className,
  intialFocus,
  resizeHandling,
  children,
}: ViewportProps) {
  const [viewportRef, setViewportRef] = useState<HTMLDivElement | null>(null);
  const [worldRef, setWorldRef] = useState<HTMLDivElement | null>(null);
  const [prevSize, setPrevSize] = useState<ObservedSize>({
    width: undefined,
    height: undefined,
  });

  const [getTransform, setTransform] = useMemo(() => {
    if (viewportRef === null || worldRef === null) return [];

    const viewportSelection = d3.select(viewportRef);
    const worldSelection = d3.select(worldRef);

    const zoom = d3
      .zoom<HTMLDivElement, unknown>()
      .on("zoom", ({ transform }) => {
        worldSelection.style(
          "transform",
          `matrix3d(${transform.k}, 0, 0, 0, 0, ${transform.k}, 0, 0, 0, 0, 1, 0, ${transform.x}, ${transform.y}, 0, 1)`
        );
      });

    viewportSelection.call(zoom);

    const setTransform = (k: number, x: number, y: number) => {
      viewportSelection.call(zoom.transform, new d3.ZoomTransform(k, x, y));
    };

    const getTransform = () => {
      return d3.zoomTransform(viewportRef);
    };

    return [getTransform, setTransform];
  }, [viewportRef, worldRef]);

  useResizeObserver({
    ref: viewportRef,
    onResize: (size) => {
      setPrevSize(size);
      if (prevSize.width === undefined || prevSize.height === undefined) return;
      if (size.width === undefined || size.height === undefined) return;
      if (getTransform === undefined || setTransform === undefined) return;

      switch (resizeHandling) {
        case "clip":
          {
            const dw = prevSize.width - size.width;
            const dh = prevSize.height - size.height;

            const { k, x, y } = getTransform();

            setTransform(k, x - dw / 2, y - dh / 2);
          }
          break;
        case "contain":
          {
            const { k, x, y } = getTransform();

            const { newScale, newPos } = focusRect(
              { width: size.width, height: size.height },
              {
                x: -x / k,
                y: -y / k,
                width: prevSize.width / k,
                height: prevSize.height / k,
              }
            );

            setTransform(newScale, newPos.x, newPos.y);
          }
          break;
      }
    },
  });

  useEffect(() => {
    if (viewportRef === null) return;
    if (setTransform === undefined) return;

    const rect = viewportRef.getBoundingClientRect();
    const { newScale, newPos } = focusRect(rect, intialFocus);

    setTransform(newScale, newPos.x, newPos.y);
  }, [intialFocus, viewportRef, setTransform]);

  return (
    <div
      ref={setViewportRef}
      className={classNames(className, styles.viewport)}
    >
      <div ref={setWorldRef} className={classNames(styles.world)}>
        {children}
      </div>
    </div>
  );
}
