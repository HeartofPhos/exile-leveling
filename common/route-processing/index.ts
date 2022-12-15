import { Area, Gem } from "../types";
import { areas } from "../data";
import { FragmentStep, parseFragmentStep } from "./fragment";
import { GemStep } from "./gems";
import { ScopedLogger } from "./scoped-logger";

export type Step = FragmentStep | GemStep;
export type Route = Step[];

export interface RouteState {
  implicitWaypoints: Set<Area["id"]>;
  explicitWaypoints: Set<Area["id"]>;
  usedWaypoints: Set<Area["id"]>;
  craftingAreas: Set<Area["id"]>;
  currentAreaId: Area["id"];
  lastTownAreaId: Area["id"];
  portalAreaId: Area["id"] | null;
  acquiredGems: Set<Gem["id"]>;
  preprocessorDefinitions: Set<string>;
  logger: ScopedLogger;
}

export function parseRoute(routeSources: string[], state: RouteState) {
  const routes: Route[] = [];
  try {
    for (let routeIndex = 0; routeIndex < routeSources.length; routeIndex++) {
      const routeSource = routeSources[routeIndex];
      state.logger.pushScope(`act ${routeIndex + 1}`);

      const routeLines = routeSource.split(/(?:\r\n|\r|\n)/g);

      const conditionalStack: boolean[] = [];
      const route: Route = [];
      for (let lineIndex = 0; lineIndex < routeLines.length; lineIndex++) {
        const line = routeLines[lineIndex];

        if (!line) continue;

        const endifRegex = /^\s*#endif/g;
        const endifMatch = endifRegex.exec(line);

        if (endifMatch) {
          const value = conditionalStack.pop();
          if (value === undefined) state.logger.warn("unexpected #endif");
        }

        const evaluateLine =
          conditionalStack.length == 0 ||
          conditionalStack[conditionalStack.length - 1];
        if (!evaluateLine) continue;

        const ifdefRegex = /^\s*#ifdef\s+(\w+)/g;
        const ifdefMatch = ifdefRegex.exec(line);

        if (ifdefMatch) {
          const value = ifdefMatch[1];
          conditionalStack.push(state.preprocessorDefinitions.has(value));
        } else {
          state.logger.pushScope(`line ${lineIndex + 1}`);
          const step = parseFragmentStep(line, state);
          if (step.parts.length > 0) route.push(step);
          state.logger.popScope();
        }
      }

      if (conditionalStack.length != 0) state.logger.warn("expected #endif");

      routes.push(route);

      state.logger.popScope();
    }
  } catch (e) {
    console.error(e);
  }

  for (const waypoint of state.explicitWaypoints) {
    if (!state.usedWaypoints.has(waypoint)) {
      state.logger.warn(`unused waypoint ${waypoint}`);
    }
  }

  for (const key in areas) {
    const area = areas[key];
    if (area.crafting_recipes.length > 0 && !state.craftingAreas.has(area.id))
      state.logger.warn(
        `missing crafting area ${area.id}, ${area.crafting_recipes.join(", ")}`
      );
  }

  state.logger.drain(console);

  return routes;
}

export interface BuildData {
  characterClass: string;
  requiredGems: RequiredGem[];
  bandit: "None" | "Oak" | "Kraityn" | "Alira";
  leagueStart: boolean;
  library: boolean;
}

export interface RequiredGem {
  id: string;
  uid: number;
  note: string;
}

export function initializeRouteState() {
  const state: RouteState = {
    implicitWaypoints: new Set(),
    explicitWaypoints: new Set(),
    usedWaypoints: new Set(),
    craftingAreas: new Set(),
    currentAreaId: "1_1_1",
    lastTownAreaId: "1_1_town",
    portalAreaId: null,
    acquiredGems: new Set(),
    preprocessorDefinitions: new Set(),
    logger: new ScopedLogger(),
  };

  return state;
}
