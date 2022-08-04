import classNames from "classnames";
import { useState } from "react";
import { RecoilState, useRecoilState } from "recoil";
import styles from "./TaskList.module.css";

export const taskStyle = styles.task;

export interface TaskItemProps {
  key?: any;
  children?: React.ReactNode;
  isCompletedState?: RecoilState<boolean>;
}

interface TaskListItemProps {
  pointerDown: boolean;
}

function TaskListItem({
  children,
  isCompletedState,
  pointerDown,
}: TaskItemProps & TaskListItemProps) {
  const [isCompleted, setIsCompleted] = isCompletedState
    ? useRecoilState(isCompletedState)
    : [undefined, undefined];

  return (
    <li
      onPointerDown={() => {
        if (setIsCompleted) setIsCompleted(!isCompleted);
      }}
      onPointerEnter={() => {
        if (!pointerDown) return;
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
  const [pointerDown, setPointerDown] = useState(false);
  return (
    <ol
      className={classNames(styles.list)}
      onPointerDown={() => {
        setPointerDown(true);
      }}
      onPointerUp={() => {
        setPointerDown(false);
      }}
      onPointerLeave={() => {
        setPointerDown(false);
      }}
    >
      {items &&
        items.map(({ key, ...rest }, i) => (
          <TaskListItem key={key || i} {...rest} pointerDown={pointerDown} />
        ))}
    </ol>
  );
}
