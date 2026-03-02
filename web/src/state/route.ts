import { RouteData } from "../../../common/route-processing/types";
import { buildDataSelector } from "./build-data";
import { configSelector } from "./config";
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
    const { buildGemSteps, findCharacterGems } = await import(
      "../../../common/route-processing/gems"
    );

    const { Data } = await import("../../../common/data");

    const baseRoute = get(baseRouteSelector);
    const buildData = get(buildDataSelector);
    const settings = get(configSelector);
    const requiredGems = get(requiredGemsSelector);

    if (requiredGems.length == 0) return baseRoute;

    const route: RouteData.Route = [];
    const questGems: Set<number> = new Set();
    const vendorGems: Set<number> = new Set();

    findCharacterGems(buildData, requiredGems, questGems);

    for (const section of baseRoute) {
      const buildSection: RouteData.Section = {
        name: section.name,
        steps: [],
      };

      for (const baseStep of section.steps) {
        const gemSteps: RouteData.GemStep[] = [];
        if (baseStep.type != "fragment_step") continue;

        for (const part of baseStep.parts) {
          if (typeof part !== "string" && part.type === "quest") {
            gemSteps.push(
              ...buildGemSteps(
                part,
                buildData,
                requiredGems,
                questGems,
                vendorGems
              )
            );
          }
        }

        const skipStep = settings.gemsOnly && gemSteps.length === 0;
        if (!skipStep) {
          const searchString = gemSteps
            .map((x) => Data.Gems[x.requiredGem.id].name)
            .join("|");

          let step;
          if (searchString !== "") {
            step = structuredClone(baseStep);
            step.parts.push({
              type: "copy",
              text: `"${searchString}"`,
              side: "tail",
            });
          } else {
            step = baseStep;
          }

          buildSection.steps.push(step, ...gemSteps);
        }
      }

      if (buildSection.steps.length > 0) route.push(buildSection);
    }

    return route;
  },
});
