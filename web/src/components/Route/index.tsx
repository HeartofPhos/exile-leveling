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

interface RouteProps {}

export function RouteComponent({}: RouteProps) {
  const [route, setRoute] = useState<Route>();
  const [routeLookup, setRouteLookup] = useState<RouteLookup>();

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

      const route = await fetch("/data/route.txt")
        .then((x) => x.text())
        .then((x) => parseRoute(x, routeLookup, routeState));

      setRoute(route);
      setRouteLookup(routeLookup);
    };

    fn();
  }, []);

  const steps: JSX.Element[] = [];
  if (route && routeLookup) {
    for (let i = 0; i < route.length; i++) {
      const step = route[i];
      steps.push(<StepComponent key={i} step={step} lookup={routeLookup} />);
    }
  }

  return <div className={classNames("container", "px-2")}>{steps}</div>;
}
