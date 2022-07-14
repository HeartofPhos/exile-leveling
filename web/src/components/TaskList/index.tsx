import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./TaskList.module.css";

export const taskStyle = styles.task;

export interface TaskItemProps {
  key?: any;
  children?: React.ReactNode;
  initialIsCompleted?: boolean;
  onUpdate?: (isCompleted: boolean) => void;
}

function TaskListItem({
  children,
  initialIsCompleted,
  onUpdate,
}: TaskItemProps) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  useEffect(() => {
    if (isCompleted === undefined) return;
    if (onUpdate) onUpdate(isCompleted);
  }, [isCompleted]);

  return (
    <li
      onClick={() => {
        if (isCompleted === undefined) return;
        setIsCompleted(!isCompleted);
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
