import classNames from "classnames";
import { useEffect, useState } from "react";
import styles from "./TaskList.module.css";

export const taskStyle = styles.task;

export interface TaskItemProps {
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

export interface ListItemContext {
  initialIsCompleted?: boolean;
  onUpdate?: (isCompleted: boolean) => void;
}

interface TaskListProps {
  items?: TaskItemProps[];
}

export function TaskList({ items }: TaskListProps) {
  return (
    <ol className={classNames(styles.list)}>
      {items && items.map((item, i) => <TaskListItem key={i} {...item} />)}
    </ol>
  );
}
