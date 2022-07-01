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
      <span className={classNames("gem-text")}>{text}</span>
      <div className={classNames("order-button-group")}>
        <img
          onClick={onMoveTop}
          className={classNames("order-button")}
          src="/images/arrow-double.svg"
        />
        <img
          onClick={onMoveUp}
          className={classNames("order-button")}
          src="/images/arrow.svg"
        />
        <img
          onClick={onMoveDown}
          className={classNames("order-button", "order-button-flip")}
          src="/images/arrow.svg"
        />
      </div>
    </div>
  );
}
