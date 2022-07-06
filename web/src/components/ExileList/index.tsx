import classNames from "classnames";
import { Children, useEffect, useState } from "react";
import styles from "./ExileList.module.css";

interface ListItemProps {
  children?: React.ReactNode;
  initialIsDone?: boolean;
  onUpdate?: (isCompleted: boolean) => void;
}

export function ExileListItem({
  children,
  initialIsDone,
  onUpdate,
}: ListItemProps) {
  const [isCompleted, setIsCompleted] = useState(initialIsDone);
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

interface ListProps {
  children?: React.ReactNode;
  header: string;
  initialCompleted?: boolean[];
  onUpdate?: (index: number, isCompleted: boolean) => void;
}

export function ExileList({
  children,
  header,
  initialCompleted,
  onUpdate,
}: ListProps) {
  return (
    <div className={classNames(styles.holder)}>
      <span className={classNames(styles.header)}>{header}</span>
      <hr />
      <ol className={classNames(styles.list)}>
        {children &&
          Children.map(children, (child, i) => (
            <ExileListItem
              key={i}
              initialIsDone={initialCompleted ? initialCompleted[i] : undefined}
              onUpdate={
                onUpdate ? (isCompleted) => onUpdate(i, isCompleted) : undefined
              }
            >
              {child}
            </ExileListItem>
          ))}
      </ol>
      <hr />
    </div>
  );
}
