import { borderListStyles } from "../BorderList";
import styles from "./styles.module.css";
import classNames from "classnames";
import { RecoilState, useRecoilState } from "recoil";

export const taskStyle = styles.task;

interface TaskItemProps {
  children?: React.ReactNode;
  isCompletedState?: RecoilState<boolean>;
}

function TaskListItem({ children, isCompletedState }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = isCompletedState
    ? useRecoilState(isCompletedState)
    : [undefined, undefined];

  return (
    <li
      tabIndex={0}
      className={classNames(borderListStyles.item, styles.listItem, {
        [styles.completed]: isCompleted,
      })}
      onClick={() => {
        if (setIsCompleted) setIsCompleted(!isCompleted);
      }}
    >
      {children}
    </li>
  );
}

export type TaskListItem = (TaskItemProps & { key?: React.Key, type: "fragment_step" | "gem_step" });

export interface TaskListProps {
  items?: TaskListItem[];
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
            {children}
          </TaskListItem>
        ))}
    </ol>
  );
}
