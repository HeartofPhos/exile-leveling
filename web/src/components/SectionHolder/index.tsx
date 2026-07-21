import { useAtom } from "jotai";
import { sectionCollapseFamily } from "../../state/section-collapse";
import { TaskList, type TaskListProps } from "../TaskList";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useLayoutEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface SectionHolderProps {
  name: string;
  items: TaskListProps["items"];
}

export function SectionHolder({ name, items }: SectionHolderProps) {
  const sectionId = `section-${name.replace(/\s+/g, "_")}`;
  const [collapsed, setCollapsed] = useAtom(sectionCollapseFamily(sectionId));

  const scrollToSection = (collapsed: boolean) => {
    if (!collapsed) return;

    const element = document.getElementById(sectionId);
    if (element)
      element.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "nearest",
      });
  };

  useLayoutEffect(() => {
    scrollToSection(collapsed);
  }, [collapsed]);

  const icon = collapsed ? <FiChevronDown /> : <FiChevronUp />;
  return (
    <div id={sectionId}>
      <div className={classNames(styles.sectionbar)}>
        <button
          aria-label={name}
          className={classNames(styles.header, styles.sectionbarHeader)}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          {icon}
          <div>{`--== ${name} ==--`}</div>
          {icon}
        </button>
        <hr />
      </div>
      {collapsed || (
        <>
          <TaskList items={items} />
          <hr />
        </>
      )}
    </div>
  );
}
