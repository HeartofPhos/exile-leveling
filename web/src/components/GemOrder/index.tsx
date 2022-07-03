import classNames from "classnames";
import { Gem } from "../../../../common/types";
import { HiChevronDoubleUp, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdCircle } from "react-icons/md";
import styles from "./GemOrder.module.css";

import gemColours from "../../data/gem-colours.json";

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
      <div>
        <MdCircle
        color={gemColours[gem.primary_attribute]}
          className={classNames(styles.icon)}
        />
        <span>{gem.name}</span>
      </div>
      <div className={classNames(styles.orderButtonGroup)}>
        <div onClick={onMoveTop} className={classNames(styles.orderButton)}>
          <HiChevronDoubleUp />
        </div>
        <div onClick={onMoveUp} className={classNames(styles.orderButton)}>
          <HiChevronUp />
        </div>
        <div onClick={onMoveDown} className={classNames(styles.orderButton)}>
          <HiChevronDown />
        </div>
      </div>
    </div>
  );
}
