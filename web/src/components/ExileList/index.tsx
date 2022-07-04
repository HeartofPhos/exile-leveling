import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./ExileList.module.css";

interface RouteProps {
  header: string;
  items?: ReactNode[];
}

export function ExileList({ header, items }: RouteProps) {
  return (
    <div className={classNames(styles.holder)}>
      <span className={classNames(styles.header)}>{header}</span>
      <hr />
      <ol className={classNames(styles.list)}>
        {items && items.map((item, i) => <li key={i}>{item}</li>)}
      </ol>
      <hr />
    </div>
  );
}
