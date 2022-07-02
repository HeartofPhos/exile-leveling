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

const ROUTE_PATHS = [
  `${import.meta.env.BASE_URL}/routes/act-1.txt`,
  `${import.meta.env.BASE_URL}/routes/act-2.txt`,
  `${import.meta.env.BASE_URL}/routes/act-3.txt`,
  `${import.meta.env.BASE_URL}/routes/act-4.txt`,
  `${import.meta.env.BASE_URL}/routes/act-5.txt`,
];

interface RouteData {
  routes: Route[];
  lookup: RouteLookup;
}

function RoutesContainer() {
  const [routeData, setRouteData] = useState<RouteData>();

  useEffect(() => {
    const fn = async () => {
      const quests = await fetch(
        `${import.meta.env.BASE_URL}/data/quests.json`
      ).then((x) => x.json());

      const areas = await fetch(
        `${import.meta.env.BASE_URL}/data/areas.json`
      ).then((x) => x.json());

      const bossWaypoints = await fetch(
        `${import.meta.env.BASE_URL}/data/boss-waypoints.json`
      ).then((x) => x.json());

      const gems = await fetch(
        `${import.meta.env.BASE_URL}/data/gems.json`
      ).then((x) => x.json());

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
