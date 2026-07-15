import { useAtom } from "jotai";
import { borderListStyles, interactiveStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import type { WritableAtom } from "jotai";

interface TaskItemProps {
  children?: React.ReactNode;
  isCompletedState?: WritableAtom<boolean, [boolean], void>;
}

function TaskListItem({ children, isCompletedState }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = isCompletedState
    ? useAtom(isCompletedState)
    : [undefined, undefined];

  return (
    <li
      tabIndex={0}
      className={classNames(
        borderListStyles.item,
        interactiveStyles.hoverPrimary,
        styles.listItem,
        {
          [styles.completed]: isCompleted,
        },
      )}
      onClick={() => {
        if (setIsCompleted) setIsCompleted(!isCompleted);
      }}
    >
      {children}
    </li>
  );
}

export interface TaskListProps {
  items?: (TaskItemProps & { key?: React.Key })[];
}

export function TaskList({ items }: TaskListProps) {
  return (
    <ol className={classNames(styles.list)}>
      {items &&
        items.map(({ key, children, ...rest }, i) => (
          <TaskListItem key={key || i} {...rest}>
            <span aria-hidden className={classNames(styles.bullet)}>
              {`${i + 1}`.padStart(2, "0")}.
            </span>
            <div className={classNames(styles.task)}>{children}</div>
          </TaskListItem>
        ))}
    </ol>
  );
}
