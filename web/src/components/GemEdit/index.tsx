import { RouteData } from "../../../../common/route-processing/types";
import { formStyles, interactiveStyles } from "../../styles";
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
  onCountChange?: (value: number) => void;
}

export function GemEdit({
  requiredGem,
  onMoveTop,
  onMoveUp,
  onMoveDown,
  onDelete,
  onCountChange,
}: GemOrderProps) {
  return (
    <div className={classNames(styles.holder)}>
      <GemReward requiredGem={requiredGem} count={1} />
      <div className={classNames(styles.buttonGroup)}>
        <input
          className={classNames(formStyles.formInput, styles.inputCount)}
          value={requiredGem.count}
          onPointerDown={(e) => {
            e.currentTarget.select();
            e.preventDefault();
          }}
          onChange={(e) => {
            if (onCountChange) {
              let num = Number.parseInt(e.target.value);
              if (!isNaN(num)) onCountChange(num);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <button
          className={classNames(styles.button, interactiveStyles.activePrimary)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMoveUp) onMoveUp();
          }}
        >
          <HiChevronUp className={classNames(styles.buttonImage)} />
        </button>
        <button
          className={classNames(styles.button)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMoveDown) onMoveDown();
          }}
        >
          <HiChevronDown className={classNames(styles.buttonImage)} />
        </button>
        <button
          className={classNames(styles.button)}
          onClick={(e) => {
            e.stopPropagation();
            if (onMoveTop) onMoveTop();
          }}
        >
          <HiChevronDoubleUp className={classNames(styles.buttonImage)} />
        </button>
        <button
          className={classNames(styles.button)}
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete();
          }}
        >
          <MdDeleteOutline className={classNames(styles.buttonImage)} />
        </button>
      </div>
    </div>
  );
}
