import classNames from "classnames";
import { Gem } from "../../../../common/types";
import "./GemOrder.css";

interface GemOrderProps {
  gem: Gem;
  onMoveTop?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function GemOrder({
  gem,
  onMoveTop,
  onMoveUp,
  onMoveDown,
}: GemOrderProps) {
  return (
    <div className={classNames("gem-order")}>
      <span className={classNames(`gem-${gem.primary_attribute}`)}>⏺ </span>
      <span className={classNames("gem-text")}>{gem.name}</span>
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
