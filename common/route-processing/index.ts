import { Area, Gem } from "../types";
import { areas } from "../data";
import { FragmentStep, parseFragmentStep } from "./fragment";
import { GemStep } from "./gems";

export type Step = FragmentStep | GemStep;
export type Route = Step[];

export interface RouteLookup {
  towns: Record<Area["act"], Area["id"]>;
}

export interface RouteState {
  implicitWaypoints: Set<Area["id"]>;
  explicitWaypoints: Set<Area["id"]>;
  usedWaypoints: Set<Area["id"]>;
  craftingAreas: Set<Area["id"]>;
  currentAreaId: Area["id"];
  lastTownAreaId: Area["id"];
  portalAreaId: Area["id"] | null;
  acquiredGems: Set<Gem["id"]>;
}

export function parseRoute(
  routeSources: string[],
  lookup: RouteLookup,
  state: RouteState
) {
  const routes: Route[] = [];
  for (const routeSource of routeSources) {
    const routeLines = routeSource.split(/(?:\r\n|\r|\n)/g);

    const route: Route = [];
    for (const line of routeLines) {
      if (!line) continue;

      const step: Step = parseFragmentStep(line, lookup, state);
      if (step.parts.length > 0) route.push(step);
    }

    routes.push(route);
  }

  for (const waypoint of state.explicitWaypoints) {
    if (!state.usedWaypoints.has(waypoint)) {
      console.log(`unused waypoint ${waypoint}`);
    }
  }

  for (const key in areas) {
    const area = areas[key];
    if (area.crafting_recipes.length > 0 && !state.craftingAreas.has(area.id))
      console.log(
        `missing crafting area ${area.id}, ${area.crafting_recipes.join(", ")}`
      );
  }

  return routes;
}

export interface BuildData {
  characterClass: string;
  requiredGems: RequiredGem[];
  bandit: "None" | "Oak" | "Kraityn" | "Alira";
}

export interface RequiredGem {
  id: string;
  uid: number;
  note: string;
}

export function initializeRouteLookup() {
  const routeLookup: RouteLookup = {
    towns: {},
  };

  for (const id in areas) {
    const area = areas[id];
    if (area.is_town_area) routeLookup.towns[area.act] = area.id;
  }

  return routeLookup;
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
  };

  return state;
}
