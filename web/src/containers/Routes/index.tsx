import { ExileFragmentStep } from "../../components/ExileFragment";
import { GemReward } from "../../components/ItemReward";
import { SectionHolder } from "../../components/SectionHolder";
import { Sidebar } from "../../components/Sidebar";
import { TaskListItem, TaskListProps } from "../../components/TaskList";
import { gemProgressSelectorFamily } from "../../state/gem-progress";
import { routeSelector } from "../../state/route";
import { routeProgressSelectorFamily } from "../../state/route-progress";
import { buildDataSelector } from "../../state/build-data";
import { withBlank } from "../../utility/withBlank";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import { ReactNode } from "react";
import { useRecoilValue } from "recoil";

function filterGemsOnly(taskItems: TaskListItem[]) {
  return taskItems.filter((item, index) => {
    const nextStep = taskItems[index + 1]
    if (!nextStep && item.type !== 'gem_step') return;
    if (item.type === 'fragment_step' && nextStep.type !== 'gem_step') return;

    return true;
  })
}

function RoutesContainer() {
  const route = useRecoilValue(routeSelector);
  const buildData = useRecoilValue(buildDataSelector);

  const items: ReactNode[] = [];

  for (let sectionIndex = 0; sectionIndex < route.length; sectionIndex++) {
    const section = route[sectionIndex];

    let taskItems: TaskListProps["items"] = [];
    for (let stepIndex = 0; stepIndex < section.steps.length; stepIndex++) {
      const step = section.steps[stepIndex];

      if (step.type == "fragment_step")
        taskItems.push({
          type: step.type,
          key: stepIndex,
          isCompletedState: routeProgressSelectorFamily(
            [sectionIndex, stepIndex].toString()
          ),
          children: <ExileFragmentStep key={stepIndex} step={step} />,
        });

      if (step.type == "gem_step")
        taskItems.push({
          type: step.type,
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

    if (buildData.gemMode) {
      taskItems = filterGemsOnly(taskItems);
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

export default withBlank(withScrollRestoration(RoutesContainer));
