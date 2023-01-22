import { RouteState } from "..";
import { areas, killWaypoints } from "../../data";
import { Area } from "../../types";
import {
  AscendFragment,
  EvaluateAscend,
  EvaluateTrial,
  TrialFragment,
} from "./ascendancy";
import { matchPatterns, Pattern } from "./patterns";
import {
  EvaluateQuest,
  EvaluateQuestText,
  QuestFragment,
  QuestTextFragment,
} from "./quest";

export type RawFragment = string | string[];
export type RawFragmentStep = RawFragment[];

const PATTERNS: Pattern[] = [
  // Comment
  {
    regex: /(\s*#.*)/g,
    processor: () => null,
  },
  // Text
  {
    regex: /[^{#]+/g,
    processor: (match: RegExpExecArray) => {
      return match[0];
    },
  },
  // Fragment
  {
    regex: /\{(.+?)\}/g,
    processor: (match: RegExpExecArray) => {
      const split = match[1].split("|");
      return split;
    },
  },
];

export function parseFragmentStep(text: string, state: RouteState) {
  text = text.trim();
  const rawFragmentStep: RawFragmentStep = [];

  let currentIndex = 0;
  do {
    const matchResult = matchPatterns(text, currentIndex, PATTERNS);

    if (matchResult) {
      currentIndex = matchResult.lastIndex;
      if (matchResult.rawFragment)
        rawFragmentStep.push(matchResult.rawFragment);
    } else {
      state.logger.error("invalid syntax");
      break;
    }
  } while (currentIndex < text.length);

  const step: FragmentStep = {
    type: "fragment_step",
    parts: [],
  };

  for (const subStep of rawFragmentStep) {
    if (typeof subStep == "string") {
      step.parts.push(subStep);
    } else {
      const result = evaluateFragment(subStep, state);
      if (typeof result === "string") state.logger.error(result);
      else step.parts.push(result.fragment);
    }
  }

  return step;
}
export function transitionArea(state: RouteState, area: Area) {
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
  | QuestRewardFragment
  | VendorRewardFragment
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

interface QuestRewardFragment {
  type: "quest_reward";
  item: string;
}

interface VendorRewardFragment {
  type: "vendor_reward";
  item: string;
  cost: string;
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
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const area = areas[rawFragment[1]];
  if (!area) return ERROR_MISSING_AREA;

  if (!area.connection_ids.some((x) => x == state.currentAreaId))
    state.logger.warn("not connected to current area");

  transitionArea(state, area);

  return {
    fragment: {
      type: "enter",
      areaId: area.id,
    },
  };
}

function EvaluateLogout(
  rawFragment: RawFragment,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  const townArea = areas[state.lastTownAreaId];
  transitionArea(state, townArea);
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
        state.logger.warn("missing target waypoint");

      const currentArea = areas[state.currentAreaId];
      if (!currentArea.has_waypoint) state.logger.warn(ERROR_AREA_NO_WAYPOINT);

      state.implicitWaypoints.add(currentArea.id);
      state.usedWaypoints.add(area.id);

      areaId = area.id;
      transitionArea(state, area);
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
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  const area = areas[state.currentAreaId];
  if (!area) return ERROR_MISSING_AREA;
  if (!area.has_waypoint) state.logger.warn(ERROR_AREA_NO_WAYPOINT);
  if (state.implicitWaypoints.has(area.id))
    state.logger.warn("waypoint already acquired");

  state.explicitWaypoints.add(area.id);

  return {
    fragment: {
      type: "get_waypoint",
    },
  };
}

function EvaluatePortal(
  rawFragment: RawFragment,
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
        if (!currentArea.parent_town_area_id)
          return "cannot use portal in this area";

        const townArea = areas[currentArea.parent_town_area_id];
        transitionArea(state, townArea);
        state.portalAreaId = state.currentAreaId;
      } else if (currentArea.id == portalArea.parent_town_area_id) {
        transitionArea(state, portalArea);
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

function EvaluateQuestReward(
  rawFragment: RawFragment,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const currentArea = areas[state.currentAreaId];
  if (!currentArea.is_town_area)
    state.logger.warn("quest_reward used outside of town");

  return {
    fragment: {
      type: "quest_reward",
      item: rawFragment[1],
    },
  };
}

function EvaluateVendorReward(
  rawFragment: RawFragment,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 3) return ERROR_INVALID_FORMAT;

  const currentArea = areas[state.currentAreaId];
  if (!currentArea.is_town_area)
    state.logger.warn("vendor_reward used outside of town");

  return {
    fragment: {
      type: "vendor_reward",
      item: rawFragment[1],
      cost: rawFragment[2],
    },
  };
}

function EvaluateGeneric(
  rawFragment: RawFragment,
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
  state: RouteState
): string | EvaluateResult {
  switch (rawFragment[0]) {
    case "kill":
      return EvaluateKill(rawFragment, state);
    case "arena":
      return EvaluateArena(rawFragment, state);
    case "area":
      return EvaluateArea(rawFragment, state);
    case "enter":
      return EvaluateEnter(rawFragment, state);
    case "logout":
      return EvaluateLogout(rawFragment, state);
    case "waypoint":
      return EvaluateWaypoint(rawFragment, state);
    case "get_waypoint":
      return EvaluateGetWaypoint(rawFragment, state);
    case "portal":
      return EvaluatePortal(rawFragment, state);
    case "quest":
      return EvaluateQuest(rawFragment, state);
    case "quest_text":
      return EvaluateQuestText(rawFragment, state);
    case "generic":
      return EvaluateGeneric(rawFragment, state);
    case "quest_reward":
      return EvaluateQuestReward(rawFragment, state);
    case "vendor_reward":
      return EvaluateVendorReward(rawFragment, state);
    case "trial":
      return EvaluateTrial(rawFragment, state);
    case "ascend":
      return EvaluateAscend(rawFragment, state);
    case "crafting":
      return EvaluateCrafting(rawFragment, state);
    case "dir":
      return EvaluateDirection(rawFragment, state);
  }

  return ERROR_INVALID_FORMAT;
}
