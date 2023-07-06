import { borderListStyles, interactiveStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";

interface SelectListProps<T> {
  items: T[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  getLabel: (index: number) => React.ReactNode;
}

export function SelectList<T>({
  items,
  selectedIndex,
  getLabel,
  onSelect,
}: SelectListProps<T>) {
  return (
    <div className={classNames(styles.selectList)}>
      {items.map((item, i) => (
        <div
          key={i}
          className={classNames(
            borderListStyles.itemRound,
            styles.selectListItem,
            {
              [interactiveStyles.hoverPrimary]: selectedIndex !== i,
              [styles.selected]: selectedIndex === i,
            }
          )}
          onClick={() => {
            onSelect(i);
          }}
        >
          {getLabel(i)}
        </div>
      ))}
    </div>
  );
}
