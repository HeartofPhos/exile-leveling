import { useEffect, useState } from "react";
import {
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
  Route,
  RouteLookup,
} from "../../../../common/routes";
import { ExileList } from "../../components/ExileList";
import { ExileStep } from "../../components/ExileStep";

function getDataUrl(path: string) {
  return new URL(`/src/data/${path}`, import.meta.url).href;
}

const ROUTE_PATHS = [
  getDataUrl(`routes/act-1.txt`),
  getDataUrl(`routes/act-2.txt`),
  getDataUrl(`routes/act-3.txt`),
  getDataUrl(`routes/act-4.txt`),
  getDataUrl(`routes/act-5.txt`),
];

const DATA_PATHS = [
  getDataUrl(`quests.json`),
  getDataUrl(`areas.json`),
  getDataUrl(`boss-waypoints.json`),
  getDataUrl(`gems.json`),
];

interface RouteData {
  routes: Route[];
  lookup: RouteLookup;
}

function RoutesContainer() {
  const [routeData, setRouteData] = useState<RouteData>();

  useEffect(() => {
    const fn = async () => {
      const [quests, areas, bossWaypoints, gems] = await Promise.all(
        DATA_PATHS.map((x) => fetch(x).then((x) => x.json()))
      );

      const routeLookup = initializeRouteLookup(
        quests,
        areas,
        bossWaypoints,
        gems
      );
      const routeState = initializeRouteState();

      const routes: Route[] = await Promise.all(
        ROUTE_PATHS.map((x) =>
          fetch(x)
            .then((x) => x.text())
            .then((x) => parseRoute(x, routeLookup, routeState))
        )
      );

      setRouteData({ routes: routes, lookup: routeLookup });
    };

    fn();
  }, []);

  return (
    <>
      {routeData &&
        routeData.routes.map((route, i) => (
          <ExileList
            header={`--== Act ${i + 1} ==--`}
            items={route.map((step, i) => (
              <ExileStep step={step} lookup={routeData.lookup} />
            ))}
          />
        ))}
    </>
  );
}

export default RoutesContainer;
