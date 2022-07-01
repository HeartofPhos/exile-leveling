import classNames from "classnames";
import "./GemOrder.css";

interface GemOrderProps {
  text: string;
  onMoveTop?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function GemOrder({
  text,
  onMoveTop,
  onMoveUp,
  onMoveDown,
}: GemOrderProps) {
  return (
    <div className={classNames("gem-order")}>
      {text}
      <div className={classNames("order-button")} onClick={onMoveTop}>Top</div>
      <div className={classNames("order-button")} onClick={onMoveUp}>Up</div>
      <div className={classNames("order-button")} onClick={onMoveDown}>Down</div>
    </div>
  );
}
