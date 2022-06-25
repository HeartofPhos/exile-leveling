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

interface RouteProps {}

interface RouteData {
  route: Route;
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

      const route = await fetch("/routes/act-1.txt")
        .then((x) => x.text())
        .then((x) => parseRoute(x, routeLookup, routeState));

      setRouteData({ route: route, lookup: routeLookup });
    };

    fn();
  }, []);

  return (
    <ol
      className={classNames(
        "container",
        "px-2",
        "route",
        "has-text-grey-light"
      )}
    >
      {routeData &&
        routeData.route.map((step, i) => (
          <li key={i}>
            <StepComponent step={step} lookup={routeData.lookup} />
          </li>
        ))}
    </ol>
  );
}
