import { FragmentStep } from "../../components/FragmentStep";
import { GemReward } from "../../components/ItemReward";
import { SectionHolder } from "../../components/SectionHolder";
import { Sidebar } from "../../components/Sidebar";
import { TaskListProps } from "../../components/TaskList";
import { gemProgressFamily } from "../../state/gem-progress";
import { routeSelector } from "../../state/route";
import { routeProgressFamily } from "../../state/route-progress";
import { ReactNode } from "react";
import { useRecoilValue } from "recoil";

export default function RoutesContainer() {
  const route = useRecoilValue(routeSelector);

  const items: ReactNode[] = [];
  for (let sectionIndex = 0; sectionIndex < route.length; sectionIndex++) {
    const section = route[sectionIndex];

    let taskItems: TaskListProps["items"] = [];
    for (let stepIndex = 0; stepIndex < section.steps.length; stepIndex++) {
      const step = section.steps[stepIndex];

      if (step.type == "fragment_step")
        taskItems.push({
          key: stepIndex,
          isCompletedState: routeProgressFamily(
            [sectionIndex, stepIndex].toString()
          ),
          children: <FragmentStep key={stepIndex} step={step} />,
        });

      if (step.type == "gem_step")
        taskItems.push({
          key: step.requiredGem.id,
          isCompletedState: gemProgressFamily(step.requiredGem.id),
          children: (
            <GemReward
              key={taskItems.length}
              requiredGem={step.requiredGem}
              count={step.count}
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
