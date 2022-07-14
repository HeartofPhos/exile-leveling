import { ReactNode } from "react";
import {
  BuildData,
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  Route,
  RouteLookup,
} from "../../../../common/routes";
import { TaskList, TaskItemProps } from "../../components/TaskList";
import { ExileStep } from "../../components/ExileStep";
import React from "react";
import { routeFiles } from "../../../../common/data";
import { getPersistent, setPersistent } from "../../utility";
import { findGems } from "../../../../common/routes/quest";
import { GemReward } from "../../components/GemReward";

type RouteProgress = boolean[][];

interface RoutesContainerProps {}

class RoutesContainer extends React.Component<RoutesContainerProps> {
  private routes: Route[];
  private routeLookup: RouteLookup;
  private routeProgress: RouteProgress;
  private buildData: BuildData | null;

  constructor(props: RoutesContainerProps) {
    super(props);

    this.buildData = getPersistent<BuildData>("build-data");
    this.routeLookup = initializeRouteLookup();
    const routeState = initializeRouteState();
    this.routes = parseRoute(routeFiles, this.routeLookup, routeState);

    this.routeProgress =
      getPersistent<RouteProgress>("route-progress") ||
      this.routes.map((route) => route.map(() => false));
  }

  render(): ReactNode {
    const routeGems: Set<number> = new Set();
    const items: ReactNode[] = [];
    for (let routeIndex = 0; routeIndex < this.routes.length; routeIndex++) {
      const route = this.routes[routeIndex];

      let taskItems: TaskItemProps[] = [];
      for (let stepIndex = 0; stepIndex < route.length; stepIndex++) {
        const step = route[stepIndex];
        taskItems.push({
          key: stepIndex,
          initialIsCompleted: this.routeProgress[routeIndex][stepIndex],
          onUpdate: (isCompleted) => {
            this.routeProgress[routeIndex][stepIndex] = isCompleted;
            setPersistent("route-progress", this.routeProgress);
          },
          children: (
            <ExileStep key={stepIndex} step={step} lookup={this.routeLookup} />
          ),
        });

        if (this.buildData) {
          if (step.type == "fragment_step") {
            for (const part of step.parts) {
              if (typeof part !== "string" && part.type == "quest") {
                const { questGems, vendorGems } = findGems(
                  part,
                  this.buildData,
                  routeGems
                );

                for (const gemIndex of questGems) {
                  const requiredGem = this.buildData.requiredGems[gemIndex];
                  taskItems.push({
                    key: requiredGem.uid,
                    initialIsCompleted: requiredGem.acquired,
                    onUpdate: (isCompleted) => {
                      requiredGem.acquired = isCompleted;

                      setPersistent("build-data", this.buildData);
                    },
                    children: (
                      <GemReward
                        key={taskItems.length}
                        requiredGem={this.buildData.requiredGems[gemIndex]}
                        type="quest"
                      />
                    ),
                  });
                }

                for (const gemIndex of vendorGems) {
                  const requiredGem = this.buildData.requiredGems[gemIndex];
                  taskItems.push({
                    key: requiredGem.uid,
                    initialIsCompleted: requiredGem.acquired,
                    onUpdate: (isCompleted) => {
                      requiredGem.acquired = isCompleted;

                      setPersistent("build-data", this.buildData);
                    },
                    children: (
                      <GemReward
                        key={taskItems.length}
                        requiredGem={this.buildData.requiredGems[gemIndex]}
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

      items.push(
        <div key={items.length} className="header">{`--== Act ${
          routeIndex + 1
        } ==--`}</div>,
        <hr key={items.length + 1} />,
        <TaskList key={items.length + 2} items={taskItems} />,
        <hr key={items.length + 3} />
      );
    }
    return <>{items}</>;
  }
}

export default RoutesContainer;
