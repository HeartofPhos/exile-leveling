import { RouteData } from "../../../common/route-processing/types";
import { buildDataSelector } from "./build-data";
import { requiredGemsSelector } from "./gem";
import { routeFilesSelector } from "./route-files";
import { selector } from "recoil";

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

    return parseRoute(routeFiles, routeState);
  },
});

export const routeSelector = selector({
  key: "routeSelector",
  get: async ({ get }) => {
    const { buildGemSteps } = await import(
      "../../../common/route-processing/gems"
    );

    const baseRoute = get(baseRouteSelector);
    const buildData = get(buildDataSelector);
    const requiredGems = get(requiredGemsSelector);

    if (requiredGems.length == 0) return baseRoute;

    const route: RouteData.Route = [];
    const routeGems: Set<number> = new Set();
    for (const section of baseRoute) {
      const buildSection: RouteData.Section = {
        name: section.name,
        steps: [],
      };
      for (const step of section.steps) {
        buildSection.steps.push(step);
        if (step.type == "fragment_step") {
          for (const part of step.parts) {
            if (typeof part !== "string" && part.type == "quest") {
              const gemSteps = buildGemSteps(
                part,
                buildData,
                requiredGems,
                routeGems
              );
              buildSection.steps.push(...gemSteps);
            }
          }
        }
      }

      route.push(buildSection);
    }

    return route;
  },
});
