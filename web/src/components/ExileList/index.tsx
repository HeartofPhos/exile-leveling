import classNames from "classnames";
import { Children, useEffect, useState } from "react";
import styles from "./ExileList.module.css";

interface ListItemProps {
  children?: React.ReactNode;
  initialIsCompleted?: boolean;
  onUpdate?: (isCompleted: boolean) => void;
}

export function ExileListItem({
  children,
  initialIsCompleted,
  onUpdate,
}: ListItemProps) {
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

interface ListProps {
  children?: React.ReactNode;
  contextLookup?: ListItemContext[];
}

export function ExileList({ children, contextLookup }: ListProps) {
  return (
    <ol className={classNames(styles.list)}>
      {Children.map(children, (child, i) => (
        <ExileListItem
          key={i}
          initialIsCompleted={contextLookup?.[i].initialIsCompleted}
          onUpdate={contextLookup?.[i].onUpdate}
        >
          {child}
        </ExileListItem>
      ))}
    </ol>
  );
}
