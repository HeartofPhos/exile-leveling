import { sectionCollapseSelectorFamily } from "../../state/section-collapse";
import { TaskList, TaskListProps } from "../TaskList";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useLayoutEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useRecoilState } from "recoil";

interface SectionHolderProps {
  name: string;
  items: TaskListProps["items"];
}

export function SectionHolder({ name, items }: SectionHolderProps) {
  const sectionId = `section-${name.replace(/\s+/g, "_")}`;
  const [collapsed, setCollapsed] = useRecoilState(
    sectionCollapseSelectorFamily(sectionId)
  );

  const scrollToSection = (collapsed: boolean) => {
    if (!collapsed) return;

    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "auto", block: "nearest" });
  };

  useLayoutEffect(() => {
    // scrollToSection after sticky positioning is applied
    scrollToSection(collapsed);
  }, [collapsed]);

  const icon = collapsed ? <FiChevronDown /> : <FiChevronUp />;
  return (
    <div>
      <div id={sectionId} className={classNames(styles.sectionbar)}>
        <button
          aria-label={name}
          className={classNames(styles.header, styles.sectionbarHeader)}
          onClick={() => {
            const updateCollapsed = !collapsed;
            setCollapsed(updateCollapsed);

            // scrollToSection before sticky positioning is applied
            scrollToSection(updateCollapsed);
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
