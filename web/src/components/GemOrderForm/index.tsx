import { RouteData } from "../../../../common/route-processing/types";
import { gemProgressSelectorFamily } from "../../state/gem-progress";
import { GemOrder } from "../GemOrder";
import { TaskList, TaskListProps } from "../TaskList";

interface GemOrderFormProps {
  requiredGems: RouteData.RequiredGem[];
  onUpdate: (requiredGems: RouteData.RequiredGem[]) => void;
}

export function GemOrderForm({ requiredGems, onUpdate }: GemOrderFormProps) {
  const workingGems = [...requiredGems];

  const taskItems: TaskListProps["items"] = [];
  for (let i = 0; i < workingGems.length; i++) {
    const requiredGem = workingGems[i];
    taskItems.push({
      isCompletedState: gemProgressSelectorFamily(requiredGem.uid),
      children: (
        <GemOrder
          onMoveTop={() => {
            const splice = workingGems.splice(i, 1);
            workingGems.unshift(...splice);

            onUpdate(workingGems);
          }}
          onMoveUp={() => {
            if (i == 0) return;

            const swap = workingGems[i];
            workingGems[i] = workingGems[i - 1];
            workingGems[i - 1] = swap;

            onUpdate(workingGems);
          }}
          onMoveDown={() => {
            if (i == workingGems.length - 1) return;

            const swap = workingGems[i];
            workingGems[i] = workingGems[i + 1];
            workingGems[i + 1] = swap;

            onUpdate(workingGems);
          }}
          onDelete={() => {
            workingGems.splice(i, 1);

            onUpdate(workingGems);
          }}
          requiredGem={requiredGem}
        />
      ),
    });
  }

  return <TaskList items={taskItems} />;
}
