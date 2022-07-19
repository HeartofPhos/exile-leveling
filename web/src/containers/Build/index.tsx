import { TaskItemProps, TaskList } from "../../components/TaskList";
import { GemOrder } from "../../components/GemOrder";
import { BuildData } from "../../../../common/routes";
import { BuildForm } from "../../components/BuildForm";
import { gemProgressAtomFamily, buildDataAtom } from "../../utility";
import { Form, formStyles } from "../../components/Form";
import classNames from "classnames";
import { useRecoilState } from "recoil";

export function Build() {
  const [buildData, setBuildData] = useRecoilState(buildDataAtom);

  return (
    <div>
      {buildData ? (
        <Form>
          <div className={classNames(formStyles.buttonRow)}>
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
      ) : (
        <BuildForm
          onSubmit={(buildData) => {
            setBuildData(buildData);
          }}
        />
      )}
      <hr />
      {buildData &&
        GemOrderList(buildData, (updatedBuildData) => {
          setBuildData({ ...updatedBuildData });
        })}
    </div>
  );
}

function GemOrderList(
  buildData: BuildData,
  onUpdate: (buildData: BuildData) => void
) {
  const taskItems: TaskItemProps[] = [];

  for (let i = 0; i < buildData.requiredGems.length; i++) {
    const requiredGem = buildData.requiredGems[i];
    taskItems.push({
      key: requiredGem.uid,
      isCompletedState: gemProgressAtomFamily(requiredGem.uid),
      children: (
        <GemOrder
          key={i}
          onMoveTop={() => {
            const splice = buildData.requiredGems.splice(i, 1);
            buildData.requiredGems.unshift(...splice);

            onUpdate(buildData);
          }}
          onMoveUp={() => {
            if (i == 0) return;

            const swap = buildData.requiredGems[i];
            buildData.requiredGems[i] = buildData.requiredGems[i - 1];
            buildData.requiredGems[i - 1] = swap;

            onUpdate(buildData);
          }}
          onMoveDown={() => {
            if (i == buildData.requiredGems.length - 1) return;

            const swap = buildData.requiredGems[i];
            buildData.requiredGems[i] = buildData.requiredGems[i + 1];
            buildData.requiredGems[i + 1] = swap;

            onUpdate(buildData);
          }}
          onDelete={() => {
            buildData.requiredGems.splice(i, 1);

            onUpdate(buildData);
          }}
          requiredGem={requiredGem}
        />
      ),
    });
  }

  return (
    <>
      <div className="header">{buildData.characterClass}</div>
      <hr />
      <TaskList items={taskItems} />
      <hr />
    </>
  );
}
