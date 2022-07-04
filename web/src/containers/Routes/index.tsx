import { useEffect, useState } from "react";
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

//@ts-expect-error
const routesData: Record<string, string> = import.meta.glob(
  "../../data/routes/*.txt",
  { as: "raw" }
);

import quests from "../../data/quests.json";
import areas from "../../data/areas.json";
import bossWaypoints from "../../data/boss-waypoints.json";
import gems from "../../data/gems.json";

interface RouteData {
  routes: Route[];
  lookup: RouteLookup;
}

function RoutesContainer() {
  const [routeData, setRouteData] = useState<RouteData>();

  useEffect(() => {
    const fn = async () => {
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
        routes.push(parseRoute(routesData[key], routeLookup, routeState));
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
            key={i}
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
