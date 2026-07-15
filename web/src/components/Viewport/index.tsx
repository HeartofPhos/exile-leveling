import styles from "./styles.module.css";
import classNames from "classnames";
import * as d3 from "d3";
import { useEffect, useMemo, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

export interface ViewportProps {
  intialFocus: Rect;
  resizeHandling: "clip" | "contain";
  children?: React.ReactNode;
}

interface Size {
  height: number;
  width: number;
}

interface Rect extends Size {
  x: number;
  y: number;
}

const ANCHOR = {
  x: 0.5,
  y: 0.5,
};

function containRect(viewport: Size, worldFocus: Rect) {
  const scaleX = viewport.width / worldFocus.width;
  const scaleY = viewport.height / worldFocus.height;
  const newScale = Math.min(scaleX, scaleY);

  const viewportAnchorX = viewport.width * ANCHOR.x;
  const viewportAnchorY = viewport.height * ANCHOR.y;

  const focusAnchorX = worldFocus.x + worldFocus.width * ANCHOR.x;
  const focusAnchorY = worldFocus.y + worldFocus.height * ANCHOR.y;

  return {
    newScale,
    newPos: {
      x: viewportAnchorX - focusAnchorX * newScale,
      y: viewportAnchorY - focusAnchorY * newScale,
    },
  };
}

export function Viewport({
  intialFocus,
  resizeHandling,
  children,
}: ViewportProps) {
  const [viewportRef, setViewportRef] = useState<HTMLDivElement | null>(null);
  const [worldRef, setWorldRef] = useState<HTMLDivElement | null>(null);
  const [prevSize, setPrevSize] = useState<ResizeObserverSize | null>(null);

  const [getTransform, setTransform] = useMemo(() => {
    if (viewportRef === null || worldRef === null) return [];

    const viewportSelection = d3.select(viewportRef);
    const worldSelection = d3.select(worldRef);

    const zoom = d3
      .zoom<HTMLDivElement, unknown>()
      .on("zoom", ({ transform }) => {
        worldSelection.style(
          "transform",
          `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
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

  useResizeObserver(viewportRef, (entry) => {
    const size = entry.contentBoxSize.at(0) ?? null;
    setPrevSize(size);

    if (size === null) return;
    if (prevSize === null) return;
    if (getTransform === undefined || setTransform === undefined) return;

    const prevWidth = prevSize.inlineSize;
    const prevHeight = prevSize.blockSize;

    const currWidth = size.inlineSize;
    const currHeight = size.blockSize;

    switch (resizeHandling) {
      case "clip":
        {
          const dw = prevWidth - currWidth;
          const dh = prevHeight - currHeight;

          const { k, x, y } = getTransform();

          setTransform(k, x - dw * ANCHOR.x, y - dh * ANCHOR.y);
        }
        break;
      case "contain":
        {
          const { k, x, y } = getTransform();

          const { newScale, newPos } = containRect(
            { width: currWidth, height: currHeight },
            {
              x: -x / k,
              y: -y / k,
              width: prevWidth / k,
              height: prevHeight / k,
            },
          );

          setTransform(newScale, newPos.x, newPos.y);
        }
        break;
    }
  });

  useEffect(() => {
    if (viewportRef === null) return;
    if (setTransform === undefined) return;

    const rect = viewportRef.getBoundingClientRect();
    const { newScale, newPos } = containRect(rect, intialFocus);

    setTransform(newScale, newPos.x, newPos.y);
  }, [intialFocus, viewportRef, setTransform]);

  return (
    <div ref={setViewportRef} className={classNames(styles.viewport)}>
      <div ref={setWorldRef} className={classNames(styles.world)}>
        {children}
      </div>
    </div>
  );
}
