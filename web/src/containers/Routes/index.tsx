import { ReactNode } from "react";
import {
  BuildData,
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  RequiredGem,
  Route,
  RouteLookup,
} from "../../../../common/routes";
import { ExileList } from "../../components/ExileList";
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
    const acquiredGems: Set<RequiredGem["id"]> = new Set();
    const items: ReactNode[] = [];
    for (let routeIndex = 0; routeIndex < this.routes.length; routeIndex++) {
      const route = this.routes[routeIndex];

      let steps: ReactNode[] = [];
      for (let stepIndex = 0; stepIndex < route.length; stepIndex++) {
        const step = route[stepIndex];
        steps.push(
          <ExileStep key={stepIndex} step={step} lookup={this.routeLookup} />
        );

        if (this.buildData) {
          if (step.type == "fragment_step") {
            for (const part of step.parts) {
              if (typeof part !== "string" && part.type == "quest") {
                const { questGems, vendorGems } = findGems(
                  part,
                  this.buildData,
                  acquiredGems
                );

                for (const gem of questGems) {
                  steps.push(
                    <GemReward
                      key={steps.length}
                      requiredGem={gem}
                      type="quest"
                    />
                  );
                }

                for (const gem of vendorGems) {
                  steps.push(
                    <GemReward
                      key={steps.length}
                      requiredGem={gem}
                      type="vendorGems"
                    />
                  );
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
          initialCompleted={this.routeProgress[routeIndex]}
          onUpdate={(index, isCompleted) => {
            this.routeProgress[routeIndex][index] = isCompleted;
            setPersistent("route-progress", this.routeProgress);
          }}
        >
          {steps}
        </ExileList>
      );
    }
    return <>{items}</>;
  }
}
export default RoutesContainer;
