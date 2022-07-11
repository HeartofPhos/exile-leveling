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

interface RouteData {
  routes: Route[];
  lookup: RouteLookup;
}

interface RoutesContainerState {
  routeData: RouteData;
}

type RouteProgress = boolean[][];

export class RoutesContainer extends React.Component<{}, RoutesContainerState> {
  private routeProgress: RouteProgress;

  constructor(props: {}) {
    super(props);

    const buildData = getPersistent<BuildData>("build-data");
    const routeLookup = initializeRouteLookup(buildData);
    const routeState = initializeRouteState();

    const routeSources = Object.keys(routeFiles)
      .sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
      )
      .map((x) => routeFiles[x]);

    const routes = parseRoute(routeSources, routeLookup, routeState);

    this.state = {
      routeData: { routes: routes, lookup: routeLookup },
    };

    const routeProgress = getPersistent<RouteProgress>("route-progress");
    if (routeProgress) {
      this.routeProgress = routeProgress;
    } else {
      this.routeProgress = [];
      for (const route of routes) {
        this.routeProgress.push(route.map(() => false));
      }
    }
  }

  render(): ReactNode {
    return (
      <>
        {this.state.routeData.routes.map((route, routeIndex) => (
          <ExileList
            key={routeIndex}
            header={`--== Act ${routeIndex + 1} ==--`}
            initialCompleted={this.routeProgress[routeIndex]}
            onUpdate={(index, isCompleted) => {
              this.routeProgress[routeIndex][index] = isCompleted;
              setPersistent("route-progress", this.routeProgress);
            }}
          >
            {route.map((step, stepIndex) => (
              <ExileStep
                key={stepIndex}
                step={step}
                lookup={this.state.routeData.lookup}
              />
            ))}
          </ExileList>
        ))}
      </>
    );
  }
}
export default RoutesContainer;
