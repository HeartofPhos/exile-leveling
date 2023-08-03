import { ExileFragments } from "../../components/ExileFragment";
import { GemReward } from "../../components/ItemReward";
import { SectionHolder } from "../../components/SectionHolder";
import { Sidebar } from "../../components/Sidebar";
import { TaskListProps } from "../../components/TaskList";
import { gemProgressSelectorFamily } from "../../state/gem-progress";
import { routeSelector } from "../../state/route";
import { routeProgressSelectorFamily } from "../../state/route-progress";
import { withBlank } from "../../utility/withBlank";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import { ReactNode } from "react";
import { useRecoilValue } from "recoil";

function RoutesContainer() {
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
          isCompletedState: routeProgressSelectorFamily(
            [sectionIndex, stepIndex].toString()
          ),
          children: (
            <>
              <ExileFragments key={stepIndex} fragments={step.parts} />
              {step.hints.map((fragments) => (
                <ExileFragments key={stepIndex} fragments={fragments} />
              ))}
            </>
          ),
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

export default withBlank(withScrollRestoration(RoutesContainer));
