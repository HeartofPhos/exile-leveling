import classNames from "classnames";
import { useLayoutEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TaskItemProps, TaskList } from "../TaskList";
import styles from "./styles.module.css";

interface SectionHolderProps {
  name: string;
  items: TaskItemProps[];
}

export function SectionHolder({ name, items: taskItems }: SectionHolderProps) {
  const [expanded, setExpanded] = useState(true);

  const sectionId = `section-${name.replace(/\s+/g, "_")}`;
  const scrollToAct = () => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "auto", block: "nearest" });
  };

  useLayoutEffect(() => {
    // scrollToAct after sticky positioning is applied
    if (!expanded) scrollToAct();
  }, [expanded]);

  const expandIcon = expanded ? <FiChevronUp /> : <FiChevronDown />;
  return (
    <div id={sectionId}>
      <div className={classNames(styles.actbar)}>
        <div
          className={classNames(styles.header, styles.actbarHeader)}
          onClick={() => {
            const updatedExpanded = !expanded;
            setExpanded(updatedExpanded);

            // scrollToAct before sticky positioning is applied
            if (updatedExpanded) scrollToAct();
          }}
        >
          {expandIcon}
          <div>{`--== ${name} ==--`}</div>
          {expandIcon}
        </div>
        <hr />
      </div>
      {expanded && (
        <>
          <TaskList items={taskItems} />
          <hr />
        </>
      )}
    </div>
  );
}
