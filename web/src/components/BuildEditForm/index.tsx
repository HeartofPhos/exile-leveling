import classNames from "classnames";
import { BuildData } from "../../../../common/route-processing";
import { gemProgressSelectorFamily } from "../../utility/state/gem-progress-state";
import { Form, formStyles } from "../Form";
import { GemOrder } from "../GemOrder";
import { SplitRow } from "../SplitRow";
import { TaskItemProps, TaskList } from "../TaskList";

import styles from "./BuildEditForm.module.css";

export interface BuildEditFormProps {
  buildData: BuildData;
  onSubmit: (buildData: BuildData | null) => void;
}
export function BuildEditForm({ buildData, onSubmit }: BuildEditFormProps) {
  return (
    <div>
      {buildData && (
        <>
          <Form>
            <div className={classNames(formStyles.groupRight)}>
              <button
                className={classNames(formStyles.formButton)}
                onClick={() => {
                  onSubmit(null);
                }}
              >
                Reset
              </button>
            </div>
          </Form>
          <hr />
          <div className={classNames(styles.buildInfo)}>
            <SplitRow
              left={
                <div className={classNames(styles.buildInfoLabel)}>Class</div>
              }
              right={
                <div className={classNames(styles.buildInfoValue)}>
                  {buildData.characterClass}
                </div>
              }
            />
            <SplitRow
              left={
                <div className={classNames(styles.buildInfoLabel)}>Bandits</div>
              }
              right={
                <div className={classNames(styles.buildInfoValue)}>
                  {buildData.bandit == "None" ? "Kill All" : buildData.bandit}
                </div>
              }
            />
            <SplitRow
              left={
                <div className={classNames(styles.buildInfoLabel)}>
                  League Start
                </div>
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
                  />
                </div>
              }
            />
          </div>
          <hr />
          <GemOrderList
            buildData={buildData}
            onUpdate={(newBuildData) => {
              onSubmit(newBuildData);
            }}
          />
        </>
      )}
    </div>
  );
}

interface GemOrderList {
  buildData: BuildData;
  onUpdate: (buildData: BuildData) => void;
}

function GemOrderList({ buildData, onUpdate }: GemOrderList) {
  const taskItems: TaskItemProps[] = [];
  const requiredGems = [...buildData.requiredGems];
  for (let i = 0; i < requiredGems.length; i++) {
    const requiredGem = requiredGems[i];
    taskItems.push({
      key: requiredGem.uid,
      isCompletedState: gemProgressSelectorFamily(requiredGem.uid),
      children: (
        <GemOrder
          key={i}
          onMoveTop={() => {
            const splice = requiredGems.splice(i, 1);
            requiredGems.unshift(...splice);

            onUpdate({ ...buildData, requiredGems });
          }}
          onMoveUp={() => {
            if (i == 0) return;

            const swap = requiredGems[i];
            requiredGems[i] = requiredGems[i - 1];
            requiredGems[i - 1] = swap;

            onUpdate({ ...buildData, requiredGems });
          }}
          onMoveDown={() => {
            if (i == requiredGems.length - 1) return;

            const swap = requiredGems[i];
            requiredGems[i] = requiredGems[i + 1];
            requiredGems[i + 1] = swap;

            onUpdate({ ...buildData, requiredGems });
          }}
          onDelete={() => {
            requiredGems.splice(i, 1);

            onUpdate({ ...buildData, requiredGems });
          }}
          requiredGem={requiredGem}
        />
      ),
    });
  }

  return <TaskList items={taskItems} />;
}
