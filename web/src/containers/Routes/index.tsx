import { ReactNode } from "react";
import { TaskItemProps } from "../../components/TaskList";
import { GemReward } from "../../components/ItemReward";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import { useRecoilValue } from "recoil";
import { SectionHolder } from "../../components/SectionHolder";
import { ExileFragmentStep } from "../../components/ExileFragment";
import { buildRouteSelector } from "../../state";
import { gemProgressSelectorFamily } from "../../state/gem-progress";
import { routeProgressSelectorFamily } from "../../state/route";
import { Sidebar } from "../../components/Sidebar";

function RoutesContainer() {
  const route = useRecoilValue(buildRouteSelector);

  const items: ReactNode[] = [];
  for (let sectionIndex = 0; sectionIndex < route.length; sectionIndex++) {
    const section = route[sectionIndex];

    let taskItems: TaskItemProps[] = [];
    for (let stepIndex = 0; stepIndex < section.steps.length; stepIndex++) {
      const step = section.steps[stepIndex];

      if (step.type == "fragment_step")
        taskItems.push({
          key: stepIndex,
          isCompletedState: routeProgressSelectorFamily(
            [sectionIndex, stepIndex].toString()
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
              rewardType={step.rewardType}
            />
          ),
        });
    }

    items.push(
      <SectionHolder key={sectionIndex} name={section.name} items={taskItems} />
    );
  }

  return (
    <>
      <Sidebar />
      {items}
    </>
  );
}

export default withScrollRestoration(RoutesContainer);
