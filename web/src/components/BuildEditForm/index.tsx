import classNames from "classnames";
import { useRecoilState } from "recoil";
import { BuildData } from "../../../../common/route-processing";
import { buildDataSelector } from "../../utility/state/build-data-state";
import { gemProgressSelectorFamily } from "../../utility/state/gem-progress-state";
import { vendorStringsAtom } from "../../utility/state/vendor-strings";
import { Form, formStyles } from "../Form";
import { GemOrder } from "../GemOrder";
import { SplitRow } from "../SplitRow";
import { TaskItemProps, TaskList } from "../TaskList";

import styles from "./BuildEditForm.module.css";

export function BuildEditForm() {
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);
  const [vendorStrings, setVendorStringsAtom] =
    useRecoilState(vendorStringsAtom);

  return (
    <div>
      {buildData && (
        <>
          <Form>
            <div className={classNames(formStyles.groupRight)}>
              <button
                className={classNames(formStyles.formButton)}
                onClick={() => {
                  setBuildData(null);
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
                      setBuildData({
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
          <Form>
            <span className={classNames(styles.buildInfoLabel)}>
              Vendor Search Strings
            </span>
            <textarea
              spellCheck={false}
              className={classNames(
                formStyles.formInput,
                styles.vendorStringsInput
              )}
              value={vendorStrings?.join("\n")}
              onChange={(e) => {
                if (e.target.value.length == 0) setVendorStringsAtom(null);
                else
                  setVendorStringsAtom(
                    e.target.value.split(/\r\n|\r|\n/).map((x) => x.trim())
                  );
              }}
            />
          </Form>
          <hr />
          <GemOrderList
            requiredGems={buildData.requiredGems}
            onUpdate={(requiredGems) => {
              setBuildData({ ...buildData, requiredGems });
            }}
          />
        </>
      )}
    </div>
  );
}

interface GemOrderList {
  requiredGems: BuildData["requiredGems"];
  onUpdate: (requiredGems: BuildData["requiredGems"]) => void;
}

function GemOrderList({ requiredGems, onUpdate }: GemOrderList) {
  const taskItems: TaskItemProps[] = [];
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

            onUpdate(requiredGems);
          }}
          onMoveUp={() => {
            if (i == 0) return;

            const swap = requiredGems[i];
            requiredGems[i] = requiredGems[i - 1];
            requiredGems[i - 1] = swap;

            onUpdate(requiredGems);
          }}
          onMoveDown={() => {
            if (i == requiredGems.length - 1) return;

            const swap = requiredGems[i];
            requiredGems[i] = requiredGems[i + 1];
            requiredGems[i + 1] = swap;

            onUpdate(requiredGems);
          }}
          onDelete={() => {
            requiredGems.splice(i, 1);

            onUpdate(requiredGems);
          }}
          requiredGem={requiredGem}
        />
      ),
    });
  }

  return <TaskList items={taskItems} />;
}
