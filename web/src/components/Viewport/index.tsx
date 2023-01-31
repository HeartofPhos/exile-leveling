import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import useResizeObserver, { ObservedSize } from "use-resize-observer";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

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
  const rzppRef = useRef<ReactZoomPanPinchRef>(null);
  const [initialized, setInitialized] = useState(false);
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
      if (rzppRef.current === null) return;

      switch (resizePattern) {
        case "clip":
          {
            const dw = prevSize.width - size.width;
            const dh = prevSize.height - size.height;

            const x = rzppRef.current.state.positionX;
            const y = rzppRef.current.state.positionY;
            const scale = rzppRef.current.state.scale;

            rzppRef.current.setTransform(x - dw / 2, y - dh / 2, scale);
          }
          break;
        case "focus":
          {
            const x = rzppRef.current.state.positionX;
            const y = rzppRef.current.state.positionY;
            const scale = rzppRef.current.state.scale;

            const { newScale, newPos } = focusRect(
              { width: size.width, height: size.height },
              {
                x: (prevSize.width / 2 - x) / scale,
                y: (prevSize.height / 2 - y) / scale,
                width: prevSize.width / scale,
                height: prevSize.height / scale,
              }
            );

            rzppRef.current.setTransform(newPos.x, newPos.y, newScale);
          }
          break;
      }
    },
  });

  useEffect(() => {
    if (divRef.current === null) return;
    if (rzppRef.current === null) return;

    const rect = divRef.current.getBoundingClientRect();
    const { newScale, newPos } = focusRect(rect, intialFocus(rect));

    rzppRef.current.setTransform(newPos.x, newPos.y, newScale, 0);
  }, [intialFocus, divRef, initialized]);

  return (
    <div ref={divRef} className={classNames(styles.viewport)}>
      <TransformWrapper
        onInit={() => {
          setInitialized(true);
        }}
        ref={rzppRef}
        maxScale={Number.POSITIVE_INFINITY}
        minScale={Number.NEGATIVE_INFINITY}
        centerZoomedOut={false}
        limitToBounds={false}
        wheel={{ step: 0.2 }}
        pinch={{ step: 0.2 }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent>{children}</TransformComponent>
      </TransformWrapper>
    </div>
  );
}
