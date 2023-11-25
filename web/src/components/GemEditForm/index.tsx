import { RouteData } from "../../../../common/route-processing/types";
import { gemProgressSelectorFamily } from "../../state/gem-progress";
import { GemEdit } from "../GemEdit";
import { TaskList, TaskListProps } from "../TaskList";

interface GemEditFormProps {
  requiredGems: RouteData.RequiredGem[];
  onUpdate: (requiredGems: RouteData.RequiredGem[]) => void;
}

export function GemEditForm({ requiredGems, onUpdate }: GemEditFormProps) {
  const workingGems = [...requiredGems];

  const taskItems: TaskListProps["items"] = [];
  for (let i = 0; i < workingGems.length; i++) {
    const requiredGem = workingGems[i];
    taskItems.push({
      isCompletedState: gemProgressSelectorFamily(requiredGem.id),
      children: (
        <GemEdit
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
          onCountChange={(value) => {
            if (value > 0) {
              workingGems[i] = { ...workingGems[i], count: value };
              onUpdate(workingGems);
            }
          }}
        />
      ),
    });
  }

  return <TaskList items={taskItems} />;
}
