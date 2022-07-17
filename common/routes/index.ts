import { Area, Gem } from "../types";
import {
  EvaluateQuest,
  EvaluateQuestText,
  QuestFragment,
  QuestTextFragment,
} from "./quest";
import { areas, killWaypoints } from "../../common/data";

export type RawFragment = string[];
export type RawFragmentStep = (string | RawFragment)[];

export interface FragmentStep {
  type: "fragment_step";
  parts: (string | Fragment)[];
}

export type Step = FragmentStep;
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

function parseStep(text: string) {
  const regex = /(\s*#.*)|([^{#]+)|\{(.+?)\}/g;

  let rawFragmentStep: RawFragmentStep = [];

  const matches = text.matchAll(regex);
  for (const match of matches) {
    const commentMatch = match[1];
    if (commentMatch) continue;

    const textMatch = match[2];
    if (textMatch) {
      rawFragmentStep.push(textMatch);
    }

    const fragmentMatch = match[3];
    if (fragmentMatch) {
      const split = fragmentMatch.split("|");
      rawFragmentStep.push(split);
    }
  }

  return rawFragmentStep;
}

interface KillFragment {
  type: "kill";
  value: string;
}

function EvaluateKill(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;
  const bossName = rawFragment[1];

  // TODO data incomplete
  // const currentArea = state.areas[state.currentAreaId];
  // if (!currentArea.bosses.some((x) => x.name == bossName)) return false;

  const waypointUnlocks = killWaypoints[bossName];
  if (waypointUnlocks) {
    for (const waypointUnlock of waypointUnlocks) {
      state.implicitWaypoints.add(waypointUnlock);
    }
  }

  return {
    fragment: {
      type: "kill",
      value: bossName,
    },
  };
}

interface ArenaFragment {
  type: "arena";
  value: string;
}

function EvaluateArena(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "arena",
      value: rawFragment[1],
    },
  };
}

interface AreaFragment {
  type: "area";
  areaId: Area["id"];
}

function EvaluateArea(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const area = areas[rawFragment[1]];
  if (!area) return ERROR_MISSING_AREA;

  return {
    fragment: {
      type: "area",
      areaId: area.id,
    },
  };
}

interface EnterFragment {
  type: "enter";
  areaId: Area["id"];
}

function EvaluateEnter(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const area = areas[rawFragment[1]];
  if (!area) return ERROR_MISSING_AREA;
  if (!area.connection_ids.some((x) => x == state.currentAreaId))
    return "not connected to current area";

  if (area.is_town_area) {
    state.lastTownAreaId = area.id;
    if (area.has_waypoint) state.implicitWaypoints.add(area.id);
  }

  state.currentAreaId = area.id;
  return {
    fragment: {
      type: "enter",
      areaId: area.id,
    },
  };
}

interface LogoutFragment {
  type: "logout";
  areaId: Area["id"];
}

function EvaluateLogout(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  state.currentAreaId = state.lastTownAreaId;
  return {
    fragment: {
      type: "logout",
      areaId: state.currentAreaId,
    },
  };
}

interface WaypointFragment {
  type: "waypoint";
  areaId: Area["id"] | null;
}

function EvaluateWaypoint(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  {
    if (rawFragment.length != 1 && rawFragment.length != 2)
      return ERROR_INVALID_FORMAT;

    let areaId: Area["id"] | null = null;
    if (rawFragment.length == 2) {
      const area = areas[rawFragment[1]];
      if (!area) return ERROR_MISSING_AREA;
      if (
        !state.implicitWaypoints.has(area.id) &&
        !state.explicitWaypoints.has(area.id)
      )
        return "missing target waypoint";

      const currentArea = areas[state.currentAreaId];
      if (!currentArea.has_waypoint) return ERROR_AREA_NO_WAYPOINT;

      state.implicitWaypoints.add(currentArea.id);
      state.usedWaypoints.add(area.id);

      if (area.is_town_area) state.lastTownAreaId = area.id;
      state.currentAreaId = area.id;
      areaId = area.id;
    }

    return {
      fragment: {
        type: "waypoint",
        areaId: areaId,
      },
    };
  }
}

interface GetWaypointFragment {
  type: "get_waypoint";
}

function EvaluateGetWaypoint(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  const area = areas[state.currentAreaId];
  if (!area) return ERROR_MISSING_AREA;
  if (!area.has_waypoint) return ERROR_AREA_NO_WAYPOINT;
  if (state.implicitWaypoints.has(area.id)) return "waypoint already acquired";

  state.explicitWaypoints.add(area.id);

  return {
    fragment: {
      type: "get_waypoint",
    },
  };
}

interface PortalFragment {
  type: "portal";
  targetAreaId?: Area["id"];
}

function EvaluatePortal(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const currentArea = areas[state.currentAreaId];
  switch (rawFragment[1]) {
    case "set": {
      if (currentArea.is_town_area) return "portal cannot be set";

      state.portalAreaId = state.currentAreaId;
      return {
        fragment: {
          type: "portal",
        },
      };
    }
    case "use": {
      if (state.portalAreaId != currentArea.id && !currentArea.is_town_area)
        state.portalAreaId = currentArea.id;

      if (!state.portalAreaId) return "portal cannot be set";
      const portalArea = areas[state.portalAreaId];

      if (currentArea.id == portalArea.id) {
        state.portalAreaId = state.currentAreaId;
        state.currentAreaId = lookup.towns[currentArea.act];
      } else if (currentArea.id == lookup.towns[portalArea.act]) {
        state.currentAreaId = state.portalAreaId;
        state.portalAreaId = null;
      } else return "can only use portal from town or portal area";

      return {
        fragment: {
          type: "portal",
          targetAreaId: state.currentAreaId,
        },
      };
    }
  }

  return ERROR_INVALID_FORMAT;
}

interface GenericFragment {
  type: "generic";
  value: string;
}

function EvaluateGeneric(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "generic",
      value: rawFragment[1],
    },
  };
}

interface TrialFragment {
  type: "trial";
}

function EvaluateTrial(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "trial",
    },
  };
}

interface AscendFragment {
  type: "ascend";
}

function EvaluateAscend(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  const expectedAreaId = "Labyrinth_Airlock";
  const currentArea = areas[state.currentAreaId];
  if (currentArea.id != expectedAreaId) {
    const expectedArea = areas[expectedAreaId];
    return `must be in "${expectedArea.name}"`;
  }

  state.currentAreaId = state.lastTownAreaId;

  return {
    fragment: {
      type: "ascend",
    },
  };
}

interface CraftingFragment {
  type: "crafting";
  crafting_recipes: string[];
}

function EvaluateCrafting(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length > 2) return ERROR_INVALID_FORMAT;

  let area;
  if (rawFragment.length == 1) area = areas[state.currentAreaId];
  else {
    area = areas[rawFragment[1]];
    if (!area) return ERROR_MISSING_AREA;
  }
  state.craftingAreas.add(area.id);

  return {
    fragment: {
      type: "crafting",
      crafting_recipes: area.crafting_recipes,
    },
  };
}

interface DirectionFragment {
  type: "dir";
  dirIndex: number;
}

function EvaluateDirection(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const parsed = Number.parseFloat(rawFragment[1]);
  if (Number.isNaN(parsed)) return "dir value is not a number";

  let dir = parsed % 360;
  if (dir < 0) dir += 360;

  if (dir % 45 != 0) return "dir value must be in intervals of 45";

  return {
    fragment: {
      type: "dir",
      dirIndex: Math.floor(dir / 45),
    },
  };
}

export type Fragment =
  | KillFragment
  | ArenaFragment
  | AreaFragment
  | EnterFragment
  | LogoutFragment
  | WaypointFragment
  | GetWaypointFragment
  | PortalFragment
  | QuestFragment
  | QuestTextFragment
  | GenericFragment
  | TrialFragment
  | AscendFragment
  | DirectionFragment
  | CraftingFragment;

export const ERROR_INVALID_FORMAT = "invalid format";
export const ERROR_MISSING_AREA = "area does not exist";
export const ERROR_AREA_NO_WAYPOINT = "area does not have a waypoint";

export interface EvaluateResult {
  fragment: Fragment;
}

function evaluateFragment(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  switch (rawFragment[0]) {
    case "kill":
      return EvaluateKill(rawFragment, lookup, state);
    case "arena":
      return EvaluateArena(rawFragment, lookup, state);
    case "area":
      return EvaluateArea(rawFragment, lookup, state);
    case "enter":
      return EvaluateEnter(rawFragment, lookup, state);
    case "logout":
      return EvaluateLogout(rawFragment, lookup, state);
    case "waypoint":
      return EvaluateWaypoint(rawFragment, lookup, state);
    case "get_waypoint":
      return EvaluateGetWaypoint(rawFragment, lookup, state);
    case "portal":
      return EvaluatePortal(rawFragment, lookup, state);
    case "quest":
      return EvaluateQuest(rawFragment, lookup, state);
    case "quest_text":
      return EvaluateQuestText(rawFragment, lookup, state);
    case "generic":
      return EvaluateGeneric(rawFragment, lookup, state);
    case "trial":
      return EvaluateTrial(rawFragment, lookup, state);
    case "crafting":
      return EvaluateCrafting(rawFragment, lookup, state);
    case "ascend":
      return EvaluateAscend(rawFragment, lookup, state);
    case "dir":
      return EvaluateDirection(rawFragment, lookup, state);
  }

  return ERROR_INVALID_FORMAT;
}

export interface BuildData {
  characterClass: string;
  requiredGems: RequiredGem[];
}

export interface RequiredGem {
  id: string;
  uid: number;
  note: string;
  acquired: boolean;
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

      const parsedStep = parseStep(line);
      const step: Step = {
        type: "fragment_step",
        parts: [],
      };

      for (const subStep of parsedStep) {
        if (typeof subStep == "string") {
          step.parts.push(subStep);
        } else {
          const result = evaluateFragment(subStep, lookup, state);
          if (typeof result == "string") console.log(`${result}: ${subStep}`);
          else step.parts.push(result.fragment);
        }
      }

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
