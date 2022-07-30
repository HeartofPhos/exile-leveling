import classNames from "classnames";

import styles from "./SplitRow.module.css";

interface SplitRowProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SplitRow({ left, right }: SplitRowProps) {
  return (
    <div className={classNames(styles.holder)}>
      <div className={classNames(styles.left)}>{left}</div>
      <div className={classNames(styles.right)}>{right}</div>
    </div>
  );
}
