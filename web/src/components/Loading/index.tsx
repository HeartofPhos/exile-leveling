import classNames from "classnames";
import styles from "./styles.module.css";

export function Loading() {
  return (
    <div className={classNames(styles.holder)}>
      <div className={classNames(styles.loader)}></div>
    </div>
  );
}
