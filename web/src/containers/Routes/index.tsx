import { useEffect, useState } from "react";
import {
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  Route,
  RouteLookup,
} from "../../../../common/routes";
import { ExileRoute } from "../../components/ExileRoute";

const ROUTE_PATHS = [
  "/routes/act-1.txt",
  "/routes/act-2.txt",
  "/routes/act-3.txt",
  "/routes/act-4.txt",
  "/routes/act-5.txt",
];

interface RouteData {
  routes: Route[];
  lookup: RouteLookup;
}

function RoutesContainer() {
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
    <div className="App">
      {routeData &&
        routeData.routes.map((route, i) => (
          <ExileRoute
            key={i}
            header={`--== Act ${i + 1} ==--`}
            route={route}
            lookup={routeData.lookup}
          />
        ))}
    </div>
  );
}

export default RoutesContainer;
