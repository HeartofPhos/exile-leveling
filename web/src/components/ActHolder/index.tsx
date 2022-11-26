import classNames from "classnames";
import { useLayoutEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { atomFamily, useRecoilState } from "recoil";
import { TaskItemProps, TaskList } from "../TaskList";
import styles from "./ActHolder.module.css";

const actHolderState = atomFamily<boolean, number>({
  key: "actHolderState",
  default: true,
});

interface ActHolderProps {
  act: number;
  items: TaskItemProps[];
}

export function ActHolder({ act, items: taskItems }: ActHolderProps) {
  const [expanded, setExpanded] = useRecoilState(actHolderState(act));

  const id = `act-${act}`;
  const scrollToAct = () => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "auto", block: "nearest" });
  };

  useLayoutEffect(() => {
    if (!expanded) scrollToAct();
  }, [expanded]);

  const expandIcon = expanded ? <FiChevronUp /> : <FiChevronDown />;
  return (
    <div id={id}>
      <div className={classNames(styles.actHolder)}>
        <div
          className={classNames("header", styles.actHolderHeader)}
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
