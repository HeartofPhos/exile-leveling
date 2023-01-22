import { AtomEffect, selector } from "recoil";
import { clearPersistent, setPersistent } from "../utility";
import { Route } from "../../../common/route-processing";
import { buildDataSelector } from "./build-data";
import { routeFilesSelector } from "./route";

export function persistentStorageEffect<T>(key: string): AtomEffect<T | null> {
  return ({ onSet }) => {
    onSet((newValue, _, isReset) => {
      if (isReset || newValue == null) clearPersistent(key);
      else setPersistent(key, newValue);
    });
  };
}

const baseRouteSelector = selector({
  key: "baseRouteSelector",
  get: async ({ get }) => {
    const { initializeRouteState, parseRoute } = await import(
      "../../../common/route-processing"
    );

    const routeFiles = get(routeFilesSelector);
    const buildData = get(buildDataSelector);

    const routeState = initializeRouteState();

    if (buildData == null || buildData.leagueStart)
      routeState.preprocessorDefinitions.add("LEAGUE_START");

    if (buildData == null || buildData.library)
      routeState.preprocessorDefinitions.add("LIBRARY");

    const bandit = buildData?.bandit || "None";
    switch (bandit) {
      case "None":
        routeState.preprocessorDefinitions.add("BANDIT_KILL");
        break;
      case "Oak":
        routeState.preprocessorDefinitions.add("BANDIT_OAK");
        break;
      case "Kraityn":
        routeState.preprocessorDefinitions.add("BANDIT_KRAITYN");
        break;
      case "Alira":
        routeState.preprocessorDefinitions.add("BANDIT_ALIRA");
        break;
    }

    return {
      routes: parseRoute(routeFiles, routeState),
    };
  },
});

export const buildRouteSelector = selector({
  key: "buildRouteSelector",
  get: async ({ get }) => {
    const { buildGemSteps } = await import(
      "../../../common/route-processing/gems"
    );

    const routeData = get(baseRouteSelector);
    const buildData = get(buildDataSelector);

    if (!buildData) return routeData.routes;

    const buildRoutes: Route[] = [];
    const routeGems: Set<number> = new Set();
    for (const route of routeData.routes) {
      const buildRoute: Route = [];
      for (const step of route) {
        buildRoute.push(step);
        if (step.type == "fragment_step") {
          for (const part of step.parts) {
            if (typeof part !== "string" && part.type == "quest") {
              const gemSteps = buildGemSteps(part, buildData, routeGems);
              buildRoute.push(...gemSteps);
            }
          }
        }
      }

      buildRoutes.push(buildRoute);
    }

    return buildRoutes;
  },
});
