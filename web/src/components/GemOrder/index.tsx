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
        <img
          onClick={onMoveTop}
          className={classNames(styles.orderButton)}
          src="/images/arrow-double.svg"
        />
        <img
          onClick={onMoveUp}
          className={classNames(styles.orderButton)}
          src="/images/arrow.svg"
        />
        <img
          onClick={onMoveDown}
          className={classNames(styles.orderButton, styles.orderButtonFlip)}
          src="/images/arrow.svg"
        />
      </div>
    </div>
  );
}
