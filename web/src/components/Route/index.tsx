import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import {
  initializeRouteState,
  parseRoute,
  Route,
  RouteState,
} from "../../../../common/route";
import { Area } from "../../../../common/types";
import { StepComponent } from "../Step";

interface RouteProps {}

export function RouteComponent({}: RouteProps) {
  const [route, setRoute] = useState<Route>();
  const [quests, setQuests] = useState<RouteState["quests"]>();
  const [areas, setAreas] = useState<RouteState["areas"]>();
  const [bossWaypoints, setBossWaypoints] =
    useState<RouteState["bossWaypoints"]>();
  const [state, setState] = useState<RouteState>();

  useEffect(() => {
    fetch("/data/route.txt")
      .then((x) => x.text())
      .then((x) => parseRoute(x))
      .then((x) => setRoute(x));
  }, []);

  useEffect(() => {
    fetch("/data/quests.json")
      .then((x) => x.json())
      .then((x) => setQuests(x));
  }, []);

  useEffect(() => {
    fetch("/data/areas.json")
      .then((x) => x.json())
      .then((x) => setAreas(x));
  }, []);

  useEffect(() => {
    fetch("/data/boss-waypoints.json")
      .then((x) => x.json())
      .then((x) => setBossWaypoints(x));
  }, []);

  useMemo(() => {
    if (!quests || !areas || !bossWaypoints) return;

    setState(initializeRouteState(quests, areas, bossWaypoints));
  }, [quests, areas, bossWaypoints]);

  const steps: JSX.Element[] = [];
  if (route && state) {
    for (const step of route) {
      steps.push(<StepComponent step={step} state={state} />);
    }
  }

  return <div className={classNames("container", "px-2")}>{steps}</div>;
}
