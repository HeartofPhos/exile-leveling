import { RouteState } from "..";
import { Data } from "../../data";
import { GameData } from "../../types";
import { Pattern, matchPatterns } from "../patterns";
import { ScopedLogger } from "../scoped-logger";
import { RouteData } from "../types";
import { Language } from "./language";
import { Fragments } from "./types";

type RawFragment = string | string[];

const EvaluateLookup: Record<
  Language.Fragment,
  (
    rawFragment: RawFragment,
    { state, logger }: ParseContext
  ) => string | EvaluateResult
> = {
  ["kill"]: EvaluateKill,
  ["arena"]: EvaluateArena,
  ["area"]: EvaluateArea,
  ["enter"]: EvaluateEnter,
  ["logout"]: EvaluateLogout,
  ["waypoint"]: EvaluateWaypoint,
  ["waypoint_get"]: EvaluateGetWaypoint,
  ["portal"]: EvaluatePortal,
  ["quest"]: EvaluateQuest,
  ["quest_text"]: EvaluateQuestText,
  ["generic"]: EvaluateGeneric,
  ["reward_quest"]: EvaluateQuestReward,
  ["reward_vendor"]: EvaluateVendorReward,
  ["trial"]: EvaluateTrial,
  ["ascend"]: EvaluateAscend,
  ["crafting"]: EvaluateCrafting,
  ["dir"]: EvaluateDirection,
};

interface ParseContext {
  state: RouteState;
  step: RouteData.FragmentStep;
  logger: ScopedLogger;
}

const FRAGMENT_PATTERNS: Pattern<ParseContext>[] = [
  // Comment
  {
    regex: /( *#.*)/g,
    processor: () => true,
  },
  // Text
  {
    regex: /[^{#]+/g,
    processor: (match, { step }) => {
      step.parts.push(match[0]);
      return true;
    },
  },
  // Fragment
  {
    regex: /\{(.+?)\}/g,
    processor: (match, context) => {
      const split = match[1].split("|");

      const evaluateFragment = EvaluateLookup[split[0] as Language.Fragment];
      const result = evaluateFragment(split, context);
      if (typeof result === "string") context.logger.error(result);
      else context.step.parts.push(result.fragment);

      return true;
    },
  },
];

export function parseFragmentStep(
  text: string,
  state: RouteState,
  logger: ScopedLogger
) {
  const step: RouteData.FragmentStep = {
    type: "fragment_step",
    parts: [],
  };

  const context: ParseContext = {
    state,
    step,
    logger,
  };

  const success = matchPatterns(text, FRAGMENT_PATTERNS, context);
  if (!success) logger.error("invalid syntax");

  return context.step;
}

function transitionArea(state: RouteState, area: GameData.Area) {
  if (area.is_town_area) {
    state.lastTownAreaId = area.id;
    if (area.has_waypoint) state.implicitWaypoints.add(area.id);
  }

  state.currentAreaId = area.id;
}

const ERROR_INVALID_FORMAT = "invalid format";
const ERROR_MISSING_AREA = "area does not exist";
const ERROR_AREA_NO_WAYPOINT = "area does not have a waypoint";

interface EvaluateResult {
  fragment: Fragments.AnyFragment;
}

function EvaluateKill(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;
  const bossName = rawFragment[1];

  // TODO data incomplete
  // const currentArea = state.areas[state.currentAreaId];
  // if (!currentArea.bosses.some((x) => x.name == bossName)) return false;

  const waypointUnlocks = Data.KillWaypoints[bossName];
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
  { state, logger }: ParseContext
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
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const area = Data.Areas[rawFragment[1]];
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
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const area = Data.Areas[rawFragment[1]];
  if (!area) return ERROR_MISSING_AREA;

  if (!area.connection_ids.some((x) => x == state.currentAreaId))
    logger.warn("not connected to current area");

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
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  const townArea = Data.Areas[state.lastTownAreaId];
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
  { state, logger }: ParseContext
): string | EvaluateResult {
  {
    if (rawFragment.length != 1 && rawFragment.length != 2)
      return ERROR_INVALID_FORMAT;

    if (rawFragment.length == 2) {
      const area = Data.Areas[rawFragment[1]];
      if (!area) return ERROR_MISSING_AREA;
      if (
        !state.implicitWaypoints.has(area.id) &&
        !state.explicitWaypoints.has(area.id)
      )
        logger.warn("missing waypoint");

      const currentArea = Data.Areas[state.currentAreaId];
      if (!currentArea.has_waypoint) logger.warn(ERROR_AREA_NO_WAYPOINT);

      state.implicitWaypoints.add(currentArea.id);
      state.usedWaypoints.add(area.id);

      transitionArea(state, area);

      return {
        fragment: {
          type: "waypoint_use",
          dstAreaId: area.id,
          srcAreaId: currentArea.id,
        },
      };
    }

    return {
      fragment: {
        type: "waypoint",
      },
    };
  }
}

function EvaluateGetWaypoint(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;

  const area = Data.Areas[state.currentAreaId];
  if (!area) return ERROR_MISSING_AREA;
  if (!area.has_waypoint) logger.warn(ERROR_AREA_NO_WAYPOINT);
  if (state.implicitWaypoints.has(area.id))
    logger.warn("waypoint already acquired");

  state.explicitWaypoints.add(area.id);

  return {
    fragment: {
      type: "waypoint_get",
    },
  };
}

function EvaluatePortal(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const currentArea = Data.Areas[state.currentAreaId];
  switch (rawFragment[1]) {
    case "set": {
      if (currentArea.is_town_area) return "portal cannot be set";

      state.portalAreaId = state.currentAreaId;
      return {
        fragment: {
          type: "portal_set",
        },
      };
    }
    case "use": {
      if (state.portalAreaId != currentArea.id && !currentArea.is_town_area)
        state.portalAreaId = currentArea.id;

      if (!state.portalAreaId) return "portal not set";
      const portalArea = Data.Areas[state.portalAreaId];

      if (currentArea.id == portalArea.id) {
        if (!currentArea.parent_town_area_id)
          return "cannot use portal in this area";

        const townArea = Data.Areas[currentArea.parent_town_area_id];
        transitionArea(state, townArea);
      } else if (currentArea.id == portalArea.parent_town_area_id) {
        transitionArea(state, portalArea);
        state.portalAreaId = null;
      } else return "can only use portal from town or portal area";

      return {
        fragment: {
          type: "portal_use",
          dstAreaId: state.currentAreaId,
        },
      };
    }
  }

  return ERROR_INVALID_FORMAT;
}

function EvaluateQuestReward(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const currentArea = Data.Areas[state.currentAreaId];
  if (!currentArea.is_town_area)
    logger.warn("quest_reward used outside of town");

  return {
    fragment: {
      type: "reward_quest",
      item: rawFragment[1],
    },
  };
}

function EvaluateVendorReward(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2 && rawFragment.length != 3)
    return ERROR_INVALID_FORMAT;

  const currentArea = Data.Areas[state.currentAreaId];
  if (!currentArea.is_town_area)
    logger.warn("reward_vendor used outside of town");

  return {
    fragment: {
      type: "reward_vendor",
      item: rawFragment[1],
      cost: rawFragment.length == 3 ? rawFragment[2] : undefined,
    },
  };
}

function EvaluateGeneric(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
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
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length > 2) return ERROR_INVALID_FORMAT;

  let area;
  if (rawFragment.length == 1) area = Data.Areas[state.currentAreaId];
  else {
    area = Data.Areas[rawFragment[1]];
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
  { state, logger }: ParseContext
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

function EvaluateQuest(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  {
    if (rawFragment.length < 2) return ERROR_INVALID_FORMAT;

    const questId = rawFragment[1];
    const quest = Data.Quests[questId];
    if (!quest) return "invalid quest id";

    let rewardOfferIds;
    if (rawFragment.length == 2) {
      rewardOfferIds = Object.keys(quest.reward_offers);
    } else {
      rewardOfferIds = [];
      for (let i = 2; i < rawFragment.length; i++) {
        rewardOfferIds.push(rawFragment[i]);
      }
    }

    return {
      fragment: {
        type: "quest",
        questId: rawFragment[1],
        rewardOffers: rewardOfferIds,
      },
    };
  }
}

function EvaluateQuestText(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "quest_text",
      value: rawFragment[1],
    },
  };
}

function EvaluateTrial(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 1) return ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "trial",
    },
  };
}

function EvaluateAscend(
  rawFragment: RawFragment,
  { state, logger }: ParseContext
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const expectedAreaId = "Labyrinth_Airlock";
  const currentArea = Data.Areas[state.currentAreaId];
  if (currentArea.id != expectedAreaId) {
    const expectedArea = Data.Areas[expectedAreaId];
    logger.warn(`must be in "${expectedArea.name}"`);
  }

  const townArea = Data.Areas[state.lastTownAreaId];
  transitionArea(state, townArea);

  return {
    fragment: {
      type: "ascend",
      //@ts-expect-error
      version: rawFragment[1],
    },
  };
}
