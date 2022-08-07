import { RouteLookup, RouteState } from "..";
import { areas, killWaypoints } from "../../data";
import { Area } from "../../types";
import {
  AscendFragment,
  EvaluateAscend,
  EvaluateTrial,
  TrialFragment,
} from "./ascendancy";
import {
  EvaluateQuest,
  EvaluateQuestText,
  QuestFragment,
  QuestTextFragment,
} from "./quest";

export type RawFragment = string[];
export type RawFragmentStep = (string | RawFragment)[];

export function parseFragmentStep(
  text: string,
  lookup: RouteLookup,
  state: RouteState
) {
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

  const step: FragmentStep = {
    type: "fragment_step",
    parts: [],
  };

  for (const subStep of rawFragmentStep) {
    if (typeof subStep == "string") {
      step.parts.push(subStep);
    } else {
      const result = evaluateFragment(subStep, lookup, state);
      if (typeof result == "string") console.log(`${result}: ${subStep}`);
      else step.parts.push(result.fragment);
    }
  }

  return step;
}
export function transitionArea(
  lookup: RouteLookup,
  state: RouteState,
  area: Area
) {
  if (area.is_town_area) {
    state.lastTownAreaId = area.id;
    if (area.has_waypoint) state.implicitWaypoints.add(area.id);
  }

  state.currentAreaId = area.id;
}

export interface FragmentStep {
  type: "fragment_step";
  parts: (string | Fragment)[];
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

interface KillFragment {
  type: "kill";
  value: string;
}

interface ArenaFragment {
  type: "arena";
  value: string;
}

interface AreaFragment {
  type: "area";
  areaId: Area["id"];
}

interface LogoutFragment {
  type: "logout";
  areaId: Area["id"];
}

interface EnterFragment {
  type: "enter";
  areaId: Area["id"];
}

interface WaypointFragment {
  type: "waypoint";
  areaId: Area["id"] | null;
}

interface GetWaypointFragment {
  type: "get_waypoint";
}

interface GenericFragment {
  type: "generic";
  value: string;
}

interface PortalFragment {
  type: "portal";
  targetAreaId?: Area["id"];
}

interface CraftingFragment {
  type: "crafting";
  crafting_recipes: string[];
}

interface DirectionFragment {
  type: "dir";
  dirIndex: number;
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

  transitionArea(lookup, state, area);

  return {
    fragment: {
      type: "enter",
      areaId: area.id,
    },
  };
}

function EvaluateLogout(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  const townArea = areas[state.lastTownAreaId];
  transitionArea(lookup, state, townArea);
  state.portalAreaId = null;

  return {
    fragment: {
      type: "logout",
      areaId: townArea.id,
    },
  };
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

      areaId = area.id;
      transitionArea(lookup, state, area);
    }

    return {
      fragment: {
        type: "waypoint",
        areaId: areaId,
      },
    };
  }
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

      if (!state.portalAreaId) return "portal not set";
      const portalArea = areas[state.portalAreaId];

      if (currentArea.id == portalArea.id) {
        const townAreaId = lookup.towns[currentArea.act];
        const townArea = areas[townAreaId];
        transitionArea(lookup, state, townArea);
        state.portalAreaId = state.currentAreaId;
      } else if (currentArea.id == lookup.towns[portalArea.act]) {
        transitionArea(lookup, state, portalArea);
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

export const ERROR_INVALID_FORMAT = "invalid format";
export const ERROR_MISSING_AREA = "area does not exist";
export const ERROR_AREA_NO_WAYPOINT = "area does not have a waypoint";

export interface EvaluateResult {
  fragment: Fragment;
}

export function evaluateFragment(
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
    case "ascend":
      return EvaluateAscend(rawFragment, lookup, state);
    case "crafting":
      return EvaluateCrafting(rawFragment, lookup, state);
    case "dir":
      return EvaluateDirection(rawFragment, lookup, state);
  }

  return ERROR_INVALID_FORMAT;
}
