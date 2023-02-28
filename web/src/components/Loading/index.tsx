import styles from "./styles.module.css";
import classNames from "classnames";

export function Loading() {
  return (
    <div className={classNames(styles.holder)}>
      <div className={classNames(styles.loader)}></div>
    </div>
  );
}
