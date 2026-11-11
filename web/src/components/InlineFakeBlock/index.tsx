import styles from "./styles.module.css";
import type { ReactNode } from "react";

interface InlineFakeBlockProps {
  child: ReactNode;
}

export function InlineFakeBlock({ child }: InlineFakeBlockProps) {
  return <span className={styles.inlineFakeBlock}>{child}</span>;
}
