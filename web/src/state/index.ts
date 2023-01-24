import { AtomEffect, selector } from "recoil";
import { clearPersistent, setPersistent } from "../utility";
import { Route, Section } from "../../../common/route-processing";
import { buildDataSelector } from "./build-data";
import { routeFileSelector } from "./route";

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

    const routeFile = get(routeFileSelector);
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

    return parseRoute(routeFile, routeState);
  },
});

export const buildRouteSelector = selector({
  key: "buildRouteSelector",
  get: async ({ get }) => {
    const { buildGemSteps } = await import(
      "../../../common/route-processing/gems"
    );

    const baseRoute = get(baseRouteSelector);
    const buildData = get(buildDataSelector);

    if (!buildData) return baseRoute;

    const buildRoute: Route = [];
    const routeGems: Set<number> = new Set();
    for (const section of baseRoute) {
      const buildSection: Section = { name: section.name, steps: [] };
      for (const step of section.steps) {
        buildSection.steps.push(step);
        if (step.type == "fragment_step") {
          for (const part of step.parts) {
            if (typeof part !== "string" && part.type == "quest") {
              const gemSteps = buildGemSteps(part, buildData, routeGems);
              buildSection.steps.push(...gemSteps);
            }
          }
        }
      }

      buildRoute.push(buildSection);
    }

    return buildRoute;
  },
});
