import styles from "./styles.module.css";
import classNames from "classnames";
import { ReactNode } from "react";

type SidebarTooltip = {
  title: ReactNode;
} & React.PropsWithChildren;

export function SidebarTooltip({ title, children }: SidebarTooltip) {
  return (
    <div className={classNames(styles.tooltip)}>
      <div className={classNames(styles.tooltipTitle)}>{title}</div>

      {children && (
        <>
          <hr />
          {children}
        </>
      )}
    </div>
  );
}
