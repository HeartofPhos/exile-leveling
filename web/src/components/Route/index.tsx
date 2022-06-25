import classNames from "classnames";
import { useEffect, useState } from "react";
import {
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  Route,
  RouteLookup,
} from "../../../../common/route";
import { StepComponent } from "../Step";
import "./Route.css";

const ROUTE_PATHS = [
  "/routes/act-1.txt",
  "/routes/act-2.txt",
  "/routes/act-3.txt",
  "/routes/act-4.txt",
  "/routes/act-5.txt",
];

interface RouteProps {}

interface RouteData {
  routes: Route[];
  lookup: RouteLookup;
}

export function RouteComponent({}: RouteProps) {
  const [routeData, setRouteData] = useState<RouteData>();

  useEffect(() => {
    const fn = async () => {
      const quests = await fetch("/data/quests.json").then((x) => x.json());
      const areas = await fetch("/data/areas.json").then((x) => x.json());
      const bossWaypoints = await fetch("/data/boss-waypoints.json").then((x) =>
        x.json()
      );
      const gems = await fetch("/data/gems.json").then((x) => x.json());

      const routeLookup = initializeRouteLookup(
        quests,
        areas,
        bossWaypoints,
        gems
      );
      const routeState = initializeRouteState();

      let routes: Route[] = [];
      for (const path of ROUTE_PATHS) {
        const route = await fetch(path)
          .then((x) => x.text())
          .then((x) => parseRoute(x, routeLookup, routeState));

        routes.push(route);
      }

      setRouteData({ routes: routes, lookup: routeLookup });
    };

    fn();
  }, []);

  return (
    <>
      {routeData &&
        routeData.routes.map((route, i) => (
          <div
            className={classNames(
              "container",
              "has-text-grey-light",
              "is-flex",
              "is-flex-direction-column"
            )}
          >
            <span
              className={classNames(
                "has-text-white",
                "is-size-4",
                "has-text-weight-bold",
                "has-text-centered"
              )}
            >
              --== Act {i + 1} ==--
            </span>
            <ol className={classNames("route", "px-2", "mb-4")}>
              {route.map((step, i) => (
                <li key={i}>
                  <StepComponent step={step} lookup={routeData.lookup} />
                </li>
              ))}
            </ol>
          </div>
        ))}
    </>
  );
}
