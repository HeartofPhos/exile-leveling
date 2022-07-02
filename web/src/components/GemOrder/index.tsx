import classNames from "classnames";
import { Gem } from "../../../../common/types";
import styles from "./GemOrder.module.css";

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
    <div className={classNames(styles.gemOrder)}>
      <span className={classNames(`gem-${gem.primary_attribute}`)}>⏺ </span>
      <span>{gem.name}</span>
      <div className={classNames(styles.orderButtonGroup)}>
        <div className={classNames(styles.orderButton, "px-1")}>
          <img onClick={onMoveTop} src="/images/arrow-double.svg" />
        </div>
        <div className={classNames(styles.orderButton, "px-1")}>
          <img onClick={onMoveUp} src="/images/arrow.svg" />
        </div>
        <div
          className={classNames(
            styles.orderButton,
            styles.orderButtonFlip,
            "px-1"
          )}
        >
          <img onClick={onMoveDown} src="/images/arrow.svg" />
        </div>
      </div>
    </div>
  );
}
