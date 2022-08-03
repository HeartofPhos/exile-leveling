import { atomFamily, useRecoilState } from "recoil";
import { TaskItemProps, TaskList } from "../TaskList";

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

  return (
    <>
      <div
        id={`act-${act}`}
        className="header"
        onClick={() => setExpanded(!expanded)}
      >{`--== Act ${act} ==--`}</div>
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
