import { RouteData } from "../../../../common/route-processing/types";
import { interactiveStyles } from "../../styles";
import { GemReward } from "../ItemReward";
import styles from "./styles.module.css";
import classNames from "classnames";
import { HiChevronDoubleUp, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";

interface GemOrderProps {
  requiredGem: RouteData.RequiredGem;
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
      <GemReward requiredGem={requiredGem} />
      <div className={classNames(styles.orderButtonGroup)}>
        <button
          className={classNames(styles.orderButton, interactiveStyles.active)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMoveUp) onMoveUp();
          }}
        >
          <HiChevronUp className={classNames(styles.orderButtonImage)} />
        </button>
        <button
          className={classNames(styles.orderButton)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMoveDown) onMoveDown();
          }}
        >
          <HiChevronDown className={classNames(styles.orderButtonImage)} />
        </button>
        <button
          className={classNames(styles.orderButton)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMoveTop) onMoveTop();
          }}
        >
          <HiChevronDoubleUp className={classNames(styles.orderButtonImage)} />
        </button>
        <button
          className={classNames(styles.orderButton)}
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete();
          }}
        >
          <MdDeleteOutline className={classNames(styles.orderButtonImage)} />
        </button>
      </div>
    </div>
  );
}
