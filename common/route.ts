import { Area, Gem, Monster, Quest } from "./types";

export type ParsedAction = string[];
export type ParsedStep = (string | ParsedAction)[];
export type Step = (string | Action)[];
export type Route = Step[];

export type CharacterClass =
  | "Marauder"
  | "Duelist"
  | "Ranger"
  | "Shadow"
  | "Witch"
  | "Templar"
  | "Scion";

export interface RouteLookup {
  quests: Record<string, Quest>;
  areas: Record<string, Area>;
  towns: Record<Area["act"], Area["id"]>;
  bossWaypoints: Record<Monster["name"], Area["id"]>;
  gems: Record<string, Gem>;
  class: CharacterClass;
  requiredGems: Gem["id"][];
}

export interface RouteState {
  waypoints: Set<Area["id"]>;
  currentAreaId: Area["id"];
  portalAreaId: Area["id"] | null;
  recentQuests: Quest["id"][];
  acquiredGems: Set<Gem["id"]>;
}

function parseStep(text: string) {
  const regex = /(\s*#.*)|([^{]+)|\{(.+?)\}/g;

  let steps: ParsedStep = [];

  const matches = text.matchAll(regex);
  for (const match of matches) {
    const commentMatch = match[1];
    if (commentMatch) continue;

    const textMatch = match[2];
    if (textMatch) {
      steps.push(textMatch);
    }

    const actionMatch = match[3];
    if (actionMatch) {
      const split = actionMatch.split("|");
      steps.push(split);
    }
  }

  return steps;
}

interface KillAction {
  type: "kill";
  value: string;
}

interface AreaAction {
  type: "area";
  areaId: Area["id"];
}

interface EnterAction {
  type: "enter";
  areaId: Area["id"];
}

interface TownAction {
  type: "town";
}

interface WaypointAction {
  type: "waypoint";
  areaId: Area["id"] | null;
}

interface GetWaypointAction {
  type: "get_waypoint";
}

interface SetPortalAction {
  type: "set_portal";
}

interface UsePortalAction {
  type: "use_portal";
}

interface QuestAction {
  type: "quest";
  questId: Quest["id"];
}

interface QuestRewardAction {
  type: "quest_reward";
  gemId: string;
}

interface QuestItemAction {
  type: "quest_item";
  value: string;
}

interface QuestTextAction {
  type: "quest_text";
  value: string;
}

interface NpcAction {
  type: "npc";
  value: string;
}

interface VendorRewardAction {
  type: "vendor_reward";
  gemId: string;
}

interface TrialAction {
  type: "trial";
}

interface AscendAction {
  type: "ascend";
}

interface DirectionAction {
  type: "dir";
  dirIndex: number;
}

interface CraftingAction {
  type: "crafting";
}

export type Action =
  | KillAction
  | AreaAction
  | EnterAction
  | TownAction
  | WaypointAction
  | GetWaypointAction
  | SetPortalAction
  | UsePortalAction
  | QuestAction
  | QuestRewardAction
  | QuestItemAction
  | QuestTextAction
  | NpcAction
  | VendorRewardAction
  | TrialAction
  | AscendAction
  | DirectionAction
  | CraftingAction;

const ERROR_INVALID_FORMAT = "invalid format";
const ERROR_MISSING_AREA = "area does not exist";
const ERROR_AREA_NO_WAYPOINT = "area does not have a waypoint";

interface EvaluateResult {
  action?: Action;
  additionalSteps?: Step[];
}

function evaluateAction(
  action: ParsedAction,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  switch (action[0]) {
    case "kill": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;
      const bossName = action[1];

      // TODO data incomplete
      // const currentArea = state.areas[state.currentAreaId];
      // if (!currentArea.bosses.some((x) => x.name == bossName)) return false;

      const waypointUnlocks = lookup.bossWaypoints[bossName];
      if (waypointUnlocks) {
        for (const waypointUnlock of waypointUnlocks) {
          state.waypoints.add(waypointUnlock);
        }
      }

      return {
        action: {
          type: "kill",
          value: bossName,
        },
      };
    }
    case "area": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;

      const area = lookup.areas[action[1]];
      if (!area) return ERROR_MISSING_AREA;

      return {
        action: {
          type: "area",
          areaId: area.id,
        },
      };
    }
    case "enter": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;

      const area = lookup.areas[action[1]];
      if (!area) return ERROR_MISSING_AREA;
      if (!area.connection_ids.some((x) => x == state.currentAreaId))
        return "not connected to current area";

      if (area.is_town_area && area.has_waypoint) state.waypoints.add(area.id);
      state.currentAreaId = area.id;
      return {
        action: {
          type: "enter",
          areaId: area.id,
        },
      };
    }
    case "town": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;

      const area = lookup.areas[state.currentAreaId];
      state.currentAreaId = lookup.towns[area.act];
      return {
        action: {
          type: "town",
        },
      };
    }
    case "waypoint": {
      if (action.length != 1 && action.length != 2) return ERROR_INVALID_FORMAT;

      let areaId: Area["id"] | null = null;
      if (action.length == 2) {
        const area = lookup.areas[action[1]];
        if (!area) return ERROR_MISSING_AREA;
        if (!state.waypoints.has(area.id)) return "missing target waypoint";

        const currentArea = lookup.areas[state.currentAreaId];
        if (!currentArea.has_waypoint) return ERROR_AREA_NO_WAYPOINT;

        state.waypoints.add(currentArea.id);
        state.currentAreaId = area.id;
        areaId = area.id;
      }

      return {
        action: {
          type: "waypoint",
          areaId: areaId,
        },
      };
    }
    case "get_waypoint": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;

      const area = lookup.areas[state.currentAreaId];
      if (!area) return ERROR_MISSING_AREA;
      if (!area.has_waypoint) return ERROR_AREA_NO_WAYPOINT;
      if (state.waypoints.has(area.id)) return "waypoint already acquired";

      state.waypoints.add(area.id);
      return {
        action: {
          type: "get_waypoint",
        },
      };
    }
    case "set_portal": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;

      state.portalAreaId = state.currentAreaId;
      return {
        action: {
          type: "set_portal",
        },
      };
    }
    case "use_portal": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;
      if (!state.portalAreaId) return "portal must be set";

      const currentArea = lookup.areas[state.currentAreaId];
      if (currentArea.id == state.portalAreaId) {
        const townId = lookup.towns[currentArea.act];
        state.portalAreaId = state.currentAreaId;
        state.currentAreaId = townId;
      } else {
        if (!currentArea.is_town_area)
          return "can only use portal from town or portal area";
        state.currentAreaId = state.portalAreaId;
        state.portalAreaId = null;
      }

      return {
        action: {
          type: "use_portal",
        },
      };
    }
    case "quest": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;

      // TODO data incomplete
      // const quest = state.quests[action[1]];
      // if (!quest) return false;
      const questId = action[1];
      state.recentQuests.push(questId);
      const quest = lookup.quests[questId];

      const additionalSteps: Step[] = [];
      const rewardLevels: Set<number> = new Set();
      if (quest) {
        for (const gemId of lookup.requiredGems) {
          if (state.acquiredGems.has(gemId)) continue;

          const gem = lookup.gems[gemId];
          if (rewardLevels.has(gem.required_level)) continue;

          const reward = quest.quest_rewards[gemId];
          if (!reward) continue;

          const validClass =
            reward.classes.length == 0 ||
            reward.classes.some((x) => x == lookup.class);

          if (validClass) {
            state.acquiredGems.add(gemId);
            additionalSteps.push([{ type: "quest_reward", gemId: gemId }]);
            rewardLevels.add(gem.required_level);
          }
        }
      }

      return {
        action: {
          type: "quest",
          questId: action[1],
        },
        additionalSteps: additionalSteps,
      };
    }
    case "quest_item": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;
      return {
        action: {
          type: "quest_item",
          value: action[1],
        },
      };
    }
    case "quest_text": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;
      return {
        action: {
          type: "quest_text",
          value: action[1],
        },
      };
    }
    case "npc": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;
      return {
        action: {
          type: "npc",
          value: action[1],
        },
      };
    }
    case "vendor": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;

      const steps: Step[] = [];
      for (const questId of state.recentQuests) {
        const quest = lookup.quests[questId];
        if (!quest) continue;

        for (const gem of lookup.requiredGems) {
          if (state.acquiredGems.has(gem)) continue;

          const reward = quest.vendor_rewards[gem];
          if (!reward) continue;

          const validClass =
            reward.classes.length == 0 ||
            reward.classes.some((x) => x == lookup.class);

          if (validClass) {
            state.acquiredGems.add(gem);
            steps.push([{ type: "vendor_reward", gemId: gem }]);
          }
        }
      }

      state.recentQuests.length = 0;

      return {
        additionalSteps: steps,
      };
    }
    case "trial": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;
      return {
        action: {
          type: "trial",
        },
      };
    }
    case "crafting": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;
      return {
        action: {
          type: "crafting",
        },
      };
    }
    case "ascend": {
      if (action.length != 1) return ERROR_INVALID_FORMAT;

      const expectedAreaId = "Labyrinth_Airlock";
      const currentArea = lookup.areas[state.currentAreaId];
      if (currentArea.id != expectedAreaId) {
        const expectedArea = lookup.areas[expectedAreaId];
        return `must be in "${expectedArea.name}"`;
      }

      return {
        action: {
          type: "ascend",
        },
      };
    }
    case "dir": {
      if (action.length != 2) return ERROR_INVALID_FORMAT;

      const parsed = Number.parseFloat(action[1]);
      if (Number.isNaN(parsed)) return "dir value is not a number";

      let dir = parsed % 360;
      if (dir < 0) dir += 360;

      if (dir % 45 != 0) return "dir value must be in intervals of 45";

      return {
        action: {
          type: "dir",
          dirIndex: Math.floor(dir / 45),
        },
      };
    }
  }

  return ERROR_INVALID_FORMAT;
}

export function initializeRouteLookup(
  quests: RouteLookup["quests"],
  areas: RouteLookup["areas"],
  bossWaypoints: RouteLookup["bossWaypoints"],
  gems: RouteLookup["gems"]
) {
  const routeLookup: RouteLookup = {
    quests: quests,
    areas: areas,
    towns: {},
    bossWaypoints: bossWaypoints,
    gems: gems,
    class: "Templar",
    requiredGems: [
      "Spark",
      "Vitality",
      "Shield Crush",
      "Purifying Flame",
      "Ancestral Call Support",
      "Ancestral Protector",
      "Clarity",
      "Added Lightning Damage Support",
      "Added Fire Damage Support",
      "Leap Slam",
      "Precision",
    ],
  };
  for (const id in routeLookup.areas) {
    const area = routeLookup.areas[id];
    if (area.is_town_area) routeLookup.towns[area.act] = area.id;
  }

  return routeLookup;
}

export function initializeRouteState() {
  const state: RouteState = {
    waypoints: new Set(),
    currentAreaId: "1_1_1",
    portalAreaId: null,
    recentQuests: [],
    acquiredGems: new Set(),
  };

  return state;
}

export function parseRoute(
  routeData: string,
  lookup: RouteLookup,
  state: RouteState
) {
  const routeLines = routeData.split(/(?:\r\n|\r|\n)/g);

  const route: Route = [];
  for (const line of routeLines) {
    if (!line) continue;

    const parsedStep = parseStep(line);
    const step: Step = [];
    const additionalSteps: Step[] = [];
    for (const subStep of parsedStep) {
      if (typeof subStep == "string") {
        step.push(subStep);
      } else {
        const result = evaluateAction(subStep, lookup, state);
        if (typeof result == "string") console.log(`${result}: ${subStep}`);
        else {
          if (result.action) step.push(result.action);
          if (result.additionalSteps)
            additionalSteps.push(...result.additionalSteps);
        }
      }
    }
    if (step.length > 0) route.push(step);
    route.push(...additionalSteps);
  }

  return route;
}
