import { useAtom, useAtomValue } from "jotai";
import { FragmentStep } from "../../components/FragmentStep";
import { GemReward } from "../../components/ItemReward";
import { SectionHolder } from "../../components/SectionHolder";
import { Sidebar } from "../../components/Sidebar";
import type { TaskListProps } from "../../components/TaskList";
import { gemProgressFamily } from "../../state/gem-progress";
import { routeSelector, scrollToActiveEdgeEffect } from "../../state/route";
import { routeProgressFamily } from "../../state/route-progress";
import { useMemo, type ReactNode } from "react";

export default function RoutesContainer() {
  useAtom(scrollToActiveEdgeEffect);
  const route = useAtomValue(routeSelector);

  const items = useMemo(() => {
    const items: ReactNode[] = [];
    for (
      let sectionIndex = 0;
      sectionIndex < route.sections.length;
      sectionIndex++
    ) {
      const section = route.sections[sectionIndex];

      let taskItems: TaskListProps["items"] = [];
      for (let stepIndex = 0; stepIndex < section.steps.length; stepIndex++) {
        const step = section.steps[stepIndex];

        if (step.type == "fragment_step")
          taskItems.push({
            edgeIndex: step.edgeIndex,
            isCompletedState: routeProgressFamily(
              [sectionIndex, stepIndex].toString(),
            ),
            children: <FragmentStep key={stepIndex} step={step} />,
          });

        if (step.type == "gem_step")
          taskItems.push({
            edgeIndex: null,
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
        <SectionHolder
          key={sectionIndex}
          name={section.name}
          items={taskItems}
        />,
      );
    }

    return items;
  }, [route]);

  return (
    <>
      <Sidebar />
      {items}
    </>
  );
}
