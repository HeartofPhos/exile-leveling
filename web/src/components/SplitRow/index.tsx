import classNames from "classnames";
import styles from "./styles.module.css";

interface SplitRowProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function SplitRow({
  left,
  right,
  className,
  children,
  ...rest
}: SplitRowProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={classNames(styles.holder, className)} {...rest}>
      <div className={classNames(styles.left)}>{left}</div>
      {children}
      <div className={classNames(styles.right)}>{right}</div>
    </div>
  );
}
