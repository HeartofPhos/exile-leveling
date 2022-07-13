import { ReactNode } from "react";
import {
  BuildData,
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  Route,
  RouteLookup,
} from "../../../../common/routes";
import { ExileList } from "../../components/ExileList";
import { ExileStep } from "../../components/ExileStep";
import React from "react";
import { routeFiles } from "../../../../common/data";
import { getPersistent, setPersistent } from "../../utility";

type RouteProgress = boolean[][];

export class RoutesContainer extends React.Component {
  private routes: Route[];
  private routeLookup: RouteLookup;
  private routeProgress: RouteProgress;

  constructor(props: {}) {
    super(props);

    const buildData = getPersistent<BuildData>("build-data");
    this.routeLookup = initializeRouteLookup(buildData);
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
    const items: ReactNode[] = [];
    for (let routeIndex = 0; routeIndex < this.routes.length; routeIndex++) {
      const route = this.routes[routeIndex];

      let steps: ReactNode[] = [];
      for (let stepIndex = 0; stepIndex < route.length; stepIndex++) {
        const step = route[stepIndex];
        steps.push(
          <ExileStep key={stepIndex} step={step} lookup={this.routeLookup} />
        );
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
