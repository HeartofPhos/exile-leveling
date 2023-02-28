import { RequiredGem } from "../../../../common/route-processing/types";
import { InlineFakeBlock } from "../InlineFakeBlock";
import { GemReward } from "../ItemReward";
import styles from "./styles.module.css";
import classNames from "classnames";
import { HiChevronDoubleUp, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdDeleteOutline } from "react-icons/md";

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
      <GemReward requiredGem={requiredGem} />
      <div className={classNames(styles.orderButtonGroup)}>
        <InlineFakeBlock
          child={
            <HiChevronUp
              className={classNames(styles.orderButton)}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveUp) onMoveUp();
              }}
            />
          }
        />
        <InlineFakeBlock
          child={
            <HiChevronDown
              className={classNames(styles.orderButton)}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveDown) onMoveDown();
              }}
            />
          }
        />
        <InlineFakeBlock
          child={
            <HiChevronDoubleUp
              className={classNames(styles.orderButton)}
              onClick={(e) => {
                e.stopPropagation();
                if (onMoveTop) onMoveTop();
              }}
            />
          }
        />
        <InlineFakeBlock
          child={
            <MdDeleteOutline
              className={classNames(styles.orderButton)}
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete();
              }}
            />
          }
        />
      </div>
    </div>
  );
}
