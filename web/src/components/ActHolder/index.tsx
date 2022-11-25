import classNames from "classnames";
import { useEffect } from "react";
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
  useEffect(() => {
    if (expanded) return;
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "auto", block: "nearest" });
  }, [expanded]);

  const expandIcon = expanded ? <FiChevronUp /> : <FiChevronDown />;
  return (
    <div>
      <div className={classNames(styles.actHolder)}>
        <div
          id={id}
          className={classNames("header", styles.actHolderHeader)}
          onClick={() => {
            setExpanded(!expanded);
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
