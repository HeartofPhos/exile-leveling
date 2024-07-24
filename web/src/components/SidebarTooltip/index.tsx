import { ReactNode } from "react";
import styles from "./styles.module.css";
import classNames from "classnames";

type SidebarTooltip = {
  title: ReactNode;
} & React.PropsWithChildren;

export function SidebarTooltip({ title, children }: SidebarTooltip) {
  return (
    <div className={classNames(styles.tooltip)}>
      <span className={classNames(styles.tooltipTitle)}>{title}</span>

      {children && (
        <>
          <hr />
          {children}
        </>
      )}
    </div>
  );
}
