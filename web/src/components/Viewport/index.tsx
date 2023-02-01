import { useEffect, useRef, useState } from "react";
import useResizeObserver, { ObservedSize } from "use-resize-observer";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

export interface ViewportProps {
  intialFocus: Rect;
  resizePattern: "clip" | "focus";
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

            rzppRef.current.setTransform(x - dw / 2, y - dh / 2, scale, 0);
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
                x: -x / scale,
                y: -y / scale,
                width: prevSize.width / scale,
                height: prevSize.height / scale,
              }
            );

            rzppRef.current.setTransform(newPos.x, newPos.y, newScale, 0);
          }
          break;
      }
    },
  });

  useEffect(() => {
    if (divRef.current === null) return;
    if (rzppRef.current === null) return;

    const rect = divRef.current.getBoundingClientRect();
    const { newScale, newPos } = focusRect(rect, intialFocus);

    rzppRef.current.setTransform(newPos.x, newPos.y, newScale, 0);
  }, [intialFocus, divRef, initialized]);

  return (
    <div ref={divRef} className={className} style={{ overflow: "hidden" }}>
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
