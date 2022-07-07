import classNames from "classnames";
import { Gem } from "../../../../common/types";
import { HiChevronDoubleUp, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";
import styles from "./GemOrder.module.css";

import { GemReward } from "../GemReward";
import { RequiredGem } from "../../../../common/routes";

interface GemOrderProps {
  requiredGem: RequiredGem;
  onMoveTop?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

export function GemOrder({
  requiredGem,
  onMoveTop,
  onMoveUp,
  onMoveDown,
  onDelete,
}: GemOrderProps) {
  return (
    <div className={classNames(styles.gemOrder)}>
      {GemReward(requiredGem, "gem")}
      <div className={classNames(styles.orderButtonGroup)}>
        <div onClick={onMoveUp} className={classNames(styles.orderButton)}>
          <HiChevronUp />
        </div>
        <div onClick={onMoveDown} className={classNames(styles.orderButton)}>
          <HiChevronDown />
        </div>
        <div onClick={onMoveTop} className={classNames(styles.orderButton)}>
          <HiChevronDoubleUp />
        </div>
        <div onClick={onDelete} className={classNames(styles.orderButton)}>
          <MdDeleteOutline />
        </div>
      </div>
    </div>
  );
}
