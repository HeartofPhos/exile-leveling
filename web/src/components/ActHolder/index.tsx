import classNames from "classnames";
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

  const expandIcon = expanded ? <FiChevronUp /> : <FiChevronDown />;
  return (
    <>
      <div
        id={`act-${act}`}
        className={classNames("header", styles.row)}
        onClick={() => setExpanded(!expanded)}
      >
        {expandIcon}
        <div>{`--== Act ${act} ==--`}</div>
        {expandIcon}
      </div>
      <hr />
      {expanded && (
        <>
          <TaskList items={taskItems} />
          <hr />
        </>
      )}
    </>
  );
}
