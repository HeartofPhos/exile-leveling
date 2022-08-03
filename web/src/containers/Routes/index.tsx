import { ReactNode, useState } from "react";
import { TaskList, TaskItemProps } from "../../components/TaskList";
import { ExileStep } from "../../components/ExileStep";
import {
  gemProgressAtomFamily,
  routeProgressAtomFamily,
  routeDataAtom,
  buildDataAtom,
} from "../../utility/ExileSyncStore";
import { findGems } from "../../../../common/routes/quest";
import { GemReward } from "../../components/GemReward";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import { useRecoilValue } from "recoil";

function RoutesContainer() {
  const { routes, routeLookup } = useRecoilValue(routeDataAtom);
  const buildData = useRecoilValue(buildDataAtom);

  const routeGems: Set<number> = new Set();
  const items: ReactNode[] = [];
  for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
    const route = routes[routeIndex];

    let taskItems: TaskItemProps[] = [];
    for (let stepIndex = 0; stepIndex < route.length; stepIndex++) {
      const step = route[stepIndex];
      taskItems.push({
        key: stepIndex,
        isCompletedState: routeProgressAtomFamily([routeIndex, stepIndex]),
        children: (
          <ExileStep key={stepIndex} step={step} lookup={routeLookup} />
        ),
      });

      if (buildData) {
        if (step.type == "fragment_step") {
          for (const part of step.parts) {
            if (typeof part !== "string" && part.type == "quest") {
              const { questGems, vendorGems } = findGems(
                part,
                buildData,
                routeGems
              );

              for (const gemIndex of questGems) {
                const requiredGem = buildData.requiredGems[gemIndex];
                taskItems.push({
                  key: requiredGem.uid,
                  isCompletedState: gemProgressAtomFamily(requiredGem.uid),
                  children: (
                    <GemReward
                      key={taskItems.length}
                      requiredGem={buildData.requiredGems[gemIndex]}
                      type="quest"
                    />
                  ),
                });
              }

              for (const gemIndex of vendorGems) {
                const requiredGem = buildData.requiredGems[gemIndex];
                taskItems.push({
                  key: requiredGem.uid,
                  isCompletedState: gemProgressAtomFamily(requiredGem.uid),
                  children: (
                    <GemReward
                      key={taskItems.length}
                      requiredGem={buildData.requiredGems[gemIndex]}
                      type="vendor"
                    />
                  ),
                });
              }
            }
          }
        }
      }
    }

    const act = routeIndex + 1;
    items.push(<ActHolder key={act} act={act} items={taskItems} />);
  }
  return <>{items}</>;
}

interface ActHolderProps {
  act: number;
  items: TaskItemProps[];
}

export function ActHolder({ act, items: taskItems }: ActHolderProps) {
  const [expanded, setExpanded] = useState(true);

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

export default withScrollRestoration(RoutesContainer);
