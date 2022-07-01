import classNames from "classnames";
import { ReactNode } from "react";
import styles from "./ExileList.module.css";

interface RouteProps {
  header: string;
  items?: ReactNode[];
}

export function ExileList({ header, items }: RouteProps) {
  return (
    <div
      className={classNames(
        "container",
        "has-text-grey-light",
        "is-flex",
        "is-flex-direction-column",
        "px-1"
      )}
    >
      <span
        className={classNames(
          "has-text-white",
          "is-size-4",
          "has-text-weight-bold",
          "has-text-centered"
        )}
      >
        {header}
      </span>
      <ol className={classNames(styles.list, "px-2", "mb-4")}>
        {items && items.map((item, i) => <li key={i}>{item}</li>)}
      </ol>
    </div>
  );
}
