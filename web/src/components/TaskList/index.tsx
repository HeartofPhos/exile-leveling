import classNames from "classnames";
import { RecoilState, useRecoilState } from "recoil";
import styles from "./TaskList.module.css";

export const taskStyle = styles.task;

export interface TaskItemProps {
  key?: any;
  children?: React.ReactNode;
  isCompletedState?: RecoilState<boolean>;
}

function TaskListItem({ children, isCompletedState }: TaskItemProps) {
  const [isCompleted, setIsCompleted] = isCompletedState
    ? useRecoilState(isCompletedState)
    : [undefined, undefined];

  return (
    <li
      onClick={() => {
        if (setIsCompleted) setIsCompleted(!isCompleted);
      }}
      className={classNames({ [styles.completed]: isCompleted })}
    >
      {children}
    </li>
  );
}

interface TaskListProps {
  items?: TaskItemProps[];
}

export function TaskList({ items }: TaskListProps) {
  return (
    <ol className={classNames(styles.list)}>
      {items &&
        items.map(({ key, ...rest }, i) => (
          <TaskListItem key={key || i} {...rest} />
        ))}
    </ol>
  );
}
