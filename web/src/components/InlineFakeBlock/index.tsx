import classNames from "classnames";
import styles from "./InlineFakeBlock.module.css";

interface InlineFakeBlockProps {
  child: React.ReactElement;
}

export function InlineFakeBlock({ child }: InlineFakeBlockProps) {
  return <div className={classNames(styles.inlineFakeBlock)}>{child}</div>;
}
