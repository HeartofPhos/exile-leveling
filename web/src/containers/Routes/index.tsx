import { ReactNode } from "react";
import {
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  Route,
  RouteLookup,
} from "../../../../common/routes";
import { ExileList } from "../../components/ExileList";
import { ExileStep } from "../../components/ExileStep";
import React from "react";

import quests from "/data/quests.json";
import areas from "/data/areas.json";
import bossWaypoints from "/data/boss-waypoints.json";
import gems from "/data/gems.json";

//@ts-expect-error
const routesData: Record<string, string> = import.meta.glob(
  "/data/routes/*.txt",
  { as: "raw" }
);

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

    const buildDataJson = localStorage.getItem("build-data");

    let buildData = undefined;
    if (buildDataJson) buildData = JSON.parse(buildDataJson);

    const routeLookup = initializeRouteLookup(
      quests,
      areas,
      bossWaypoints,
      gems,
      buildData
    );
    const routeState = initializeRouteState();

    const routes: Route[] = [];
    const keys = Object.keys(routesData).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
    for (const key of keys) {
      const route = parseRoute(routesData[key], routeLookup, routeState);
      routes.push(route);
    }

    this.state = {
      routeData: { routes: routes, lookup: routeLookup },
    };

    const routeProgressJson = localStorage.getItem("route-progress");
    if (routeProgressJson) {
      this.routeProgress = JSON.parse(routeProgressJson);
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
              localStorage.setItem(
                "route-progress",
                JSON.stringify(this.routeProgress)
              );
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
