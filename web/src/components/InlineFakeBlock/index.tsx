import styles from "./styles.module.css";
import classNames from "classnames";
import { ReactNode } from "react";

interface InlineFakeBlockProps {
  child: ReactNode;
}

export function InlineFakeBlock({ child }: InlineFakeBlockProps) {
  return <div className={classNames(styles.inlineFakeBlock)}>{child}</div>;
}
