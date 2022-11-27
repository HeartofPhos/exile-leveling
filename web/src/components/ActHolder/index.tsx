import classNames from "classnames";
import { useLayoutEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TaskItemProps, TaskList } from "../TaskList";
import styles from "./ActHolder.module.css";

interface ActHolderProps {
  act: number;
  items: TaskItemProps[];
}

export function ActHolder({ act, items: taskItems }: ActHolderProps) {
  const [expanded, setExpanded] = useState(true);

  const id = `act-${act}`;
  const scrollToAct = () => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "auto", block: "nearest" });
  };

  useLayoutEffect(() => {
    // scrollToAct after sticky positioning is applied
    if (!expanded) scrollToAct();
  }, [expanded]);

  const expandIcon = expanded ? <FiChevronUp /> : <FiChevronDown />;
  return (
    <div id={id}>
      <div className={classNames(styles.actbar)}>
        <div
          className={classNames("header", styles.actbarHeader)}
          onClick={() => {
            const updatedExpanded = !expanded;
            setExpanded(updatedExpanded);

            // scrollToAct before sticky positioning is applied
            if (updatedExpanded) scrollToAct();
          }}
        >
          {expandIcon}
          <div>{`--== Act ${act} ==--`}</div>
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
