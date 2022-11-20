import {
  AtomEffect,
  selector,
} from "recoil";
import { clearPersistent, getPersistent, setPersistent } from "..";
import { Route } from "../../../../common/route-processing";
import { buildDataSelector } from "./build-data-state";

export function persistentStorageEffect<T>(
  key: string): AtomEffect<T | null> {
  return ({ setSelf, onSet }) => {
    const value = getPersistent<T>(key);
    if (value)
      setSelf(value);

    onSet((newValue, _, isReset) => {
      if (isReset || newValue == null)
        clearPersistent(key)
      else
        setPersistent(key, newValue);
    });
  }
};

export const baseRouteSelector = selector({
  key: "baseRouteSelector", get: async ({ get }) => {
    const { initializeRouteLookup, initializeRouteState, parseRoute } =
      await import("../../../../common/route-processing");
    const { routeFilesLookup } = await import("../../../../common/data");
    const buildData = get(buildDataSelector);

    const routeLookup = initializeRouteLookup();
    const routeState = initializeRouteState();

    if (buildData == null || buildData.leagueStart)
      routeState.preprocessorDefinitions.add("LEAGUE_START");

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

    const routeFiles = [
      routeFilesLookup["./routes/act-1.txt"],
      routeFilesLookup["./routes/act-2.txt"],
      routeFilesLookup["./routes/act-3.txt"],
      routeFilesLookup["./routes/act-4.txt"],
      routeFilesLookup["./routes/act-5.txt"],
      routeFilesLookup["./routes/act-6.txt"],
      routeFilesLookup["./routes/act-7.txt"],
      routeFilesLookup["./routes/act-8.txt"],
      routeFilesLookup["./routes/act-9.txt"],
      routeFilesLookup["./routes/act-10.txt"],
    ];

    return {
      routeLookup: routeLookup,
      routes: parseRoute(routeFiles, routeLookup, routeState),
    };
  }
})

export const buildRouteSelector = selector({
  key: "buildRouteSelector",
  get: async ({ get }) => {
    const { buildGemSteps } = await import("../../../../common/route-processing/gems");

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
