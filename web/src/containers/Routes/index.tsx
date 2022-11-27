import { ReactNode } from "react";
import { TaskItemProps } from "../../components/TaskList";
import { GemReward } from "../../components/GemReward";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import { useRecoilValue } from "recoil";
import { ActHolder } from "../../components/ActHolder";
import { ExileFragmentStep } from "../../components/ExileFragment";
import { buildRouteSelector } from "../../utility/state";
import { gemProgressSelectorFamily } from "../../utility/state/gem-progress-state";
import { routeProgressSelectorFamily } from "../../utility/state/route-progress-state";
import { Sidebar } from "../../components/Sidebar";

function RoutesContainer() {
  const routes = useRecoilValue(buildRouteSelector);

  const items: ReactNode[] = [];
  for (let routeIndex = 0; routeIndex < routes.length; routeIndex++) {
    const route = routes[routeIndex];

    let taskItems: TaskItemProps[] = [];
    for (let stepIndex = 0; stepIndex < route.length; stepIndex++) {
      const step = route[stepIndex];

      if (step.type == "fragment_step")
        taskItems.push({
          key: stepIndex,
          isCompletedState: routeProgressSelectorFamily(
            [routeIndex, stepIndex].toString()
          ),
          children: <ExileFragmentStep key={stepIndex} step={step} />,
        });

      if (step.type == "gem_step")
        taskItems.push({
          key: step.requiredGem.uid,
          isCompletedState: gemProgressSelectorFamily(step.requiredGem.uid),
          children: (
            <GemReward
              key={taskItems.length}
              requiredGem={step.requiredGem}
              type={step.rewardType}
            />
          ),
        });
    }

    const act = routeIndex + 1;
    items.push(<ActHolder key={act} act={act} items={taskItems} />);
  }

  return (
    <>
      <Sidebar />
      {items}
    </>
  );
}

export default withScrollRestoration(RoutesContainer);
