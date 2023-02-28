import {
  BuildData,
  RequiredGem,
} from "../../../../common/route-processing/types";
import { gemProgressSelectorFamily } from "../../state/gem-progress";
import { GemOrder } from "../GemOrder";
import { SplitRow } from "../SplitRow";
import { TaskItemProps, TaskList } from "../TaskList";
import styles from "./styles.module.css";
import classNames from "classnames";

interface BuildInfoFormProps {
  buildData: BuildData;
  onSubmit: (buildData: BuildData) => void;
}

export function BuildInfoForm({ buildData, onSubmit }: BuildInfoFormProps) {
  return (
    <div className={classNames(styles.buildInfo)}>
      <SplitRow
        left={<div className={classNames(styles.buildInfoLabel)}>Class</div>}
        right={
          <div className={classNames(styles.buildInfoValue)}>
            {buildData.characterClass}
          </div>
        }
      />
      <SplitRow
        left={<div className={classNames(styles.buildInfoLabel)}>Bandits</div>}
        right={
          <div className={classNames(styles.buildInfoValue)}>
            {buildData.bandit == "None" ? "Kill All" : buildData.bandit}
          </div>
        }
      />
      <SplitRow
        left={
          <div className={classNames(styles.buildInfoLabel)}>League Start</div>
        }
        right={
          <div className={classNames(styles.buildInfoValue)}>
            <input
              type="checkbox"
              checked={buildData.leagueStart}
              onChange={(evt) => {
                onSubmit({
                  ...buildData,
                  leagueStart: evt.target.checked,
                });
              }}
              aria-label="League Start"
            />
          </div>
        }
      />
      <SplitRow
        left={<div className={classNames(styles.buildInfoLabel)}>Library</div>}
        right={
          <div className={classNames(styles.buildInfoValue)}>
            <input
              type="checkbox"
              checked={buildData.library}
              onChange={(evt) => {
                onSubmit({
                  ...buildData,
                  library: evt.target.checked,
                });
              }}
              aria-label="Library"
            />
          </div>
        }
      />
    </div>
  );
}

interface GemOrderList {
  requiredGems: RequiredGem[];
  onUpdate: (requiredGems: RequiredGem[]) => void;
}

export function GemOrderList({ requiredGems, onUpdate }: GemOrderList) {
  const workingGems = [...requiredGems];

  const taskItems: TaskItemProps[] = [];
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
