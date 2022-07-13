import { ReactNode } from "react";
import {
  BuildData,
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  Route,
  RouteLookup,
} from "../../../../common/routes";
import { ExileList, ListItemContext } from "../../components/ExileList";
import { ExileStep } from "../../components/ExileStep";
import React from "react";
import { routeFiles } from "../../../../common/data";
import { getPersistent, setPersistent } from "../../utility";
import { findGems } from "../../../../common/routes/quest";
import { GemReward } from "../../components/GemReward";

type RouteProgress = boolean[][];

export class RoutesContainer extends React.Component {
  private routes: Route[];
  private routeLookup: RouteLookup;
  private routeProgress: RouteProgress;
  private buildData: BuildData | null;

  constructor(props: {}) {
    super(props);

    this.buildData = getPersistent<BuildData>("build-data");
    this.routeLookup = initializeRouteLookup();
    const routeState = initializeRouteState();
    this.routes = parseRoute(routeFiles, this.routeLookup, routeState);

    const routeProgress = getPersistent<RouteProgress>("route-progress");
    if (routeProgress) {
      this.routeProgress = routeProgress;
    } else {
      this.routeProgress = [];
      for (const route of this.routes) {
        this.routeProgress.push(route.map(() => false));
      }
    }
  }

  render(): ReactNode {
    const routeGems: Set<number> = new Set();
    const items: ReactNode[] = [];
    for (let routeIndex = 0; routeIndex < this.routes.length; routeIndex++) {
      let contextLookup: ListItemContext[] = [];

      const route = this.routes[routeIndex];

      let steps: ReactNode[] = [];
      for (let stepIndex = 0; stepIndex < route.length; stepIndex++) {
        const step = route[stepIndex];
        steps.push(
          <ExileStep key={stepIndex} step={step} lookup={this.routeLookup} />
        );
        contextLookup.push({
          initialIsCompleted: this.routeProgress[routeIndex][stepIndex],
          onUpdate: (isCompleted) => {
            this.routeProgress[routeIndex][stepIndex] = isCompleted;
            setPersistent("route-progress", this.routeProgress);
          },
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
                  steps.push(
                    <GemReward
                      key={steps.length}
                      requiredGem={this.buildData.requiredGems[gemIndex]}
                      type="quest"
                    />
                  );
                  contextLookup.push({
                    initialIsCompleted:
                      this.buildData.requiredGems[gemIndex].acquired,
                    onUpdate: (isCompleted) => {
                      this.buildData!.requiredGems[gemIndex].acquired =
                        isCompleted;

                      setPersistent("build-data", this.buildData);
                    },
                  });
                }

                for (const gemIndex of vendorGems) {
                  steps.push(
                    <GemReward
                      key={steps.length}
                      requiredGem={this.buildData.requiredGems[gemIndex]}
                      type="vendor"
                    />
                  );
                  contextLookup.push({
                    initialIsCompleted:
                      this.buildData.requiredGems[gemIndex].acquired,
                    onUpdate: (isCompleted) => {
                      this.buildData!.requiredGems[gemIndex].acquired =
                        isCompleted;

                      setPersistent("build-data", this.buildData);
                    },
                  });
                }
              }
            }
          }
        }
      }

      items.push(
        <ExileList
          key={routeIndex}
          header={`--== Act ${routeIndex + 1} ==--`}
          contextLookup={contextLookup}
        >
          {steps}
        </ExileList>
      );
    }
    return <>{items}</>;
  }
}
export default RoutesContainer;
