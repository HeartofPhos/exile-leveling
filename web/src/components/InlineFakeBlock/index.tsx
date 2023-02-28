import styles from "./styles.module.css";
import classNames from "classnames";

interface InlineFakeBlockProps {
  child: React.ReactElement;
}

export function InlineFakeBlock({ child }: InlineFakeBlockProps) {
  return <div className={classNames(styles.inlineFakeBlock)}>{child}</div>;
}
