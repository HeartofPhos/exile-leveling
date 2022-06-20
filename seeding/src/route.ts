import fs from "fs";
import readline from "readline";
import { Area, Monster, Quest } from "../../types";

type Action = string[];
type Step = (string | Action)[];

export function InitializeRouteState(
  quests: Record<string, Quest>,
  areas: Record<string, Area>,
  bossWaypoints: Record<Monster["name"], Area["id"]>
): RouteState {
  const state: RouteState = {
    quests: quests,
    areas: areas,
    towns: {},
    bossWaypoints: bossWaypoints,
    waypoints: new Set(),
    currentAreaId: "1_1_1",
    portalAreaId: null,
  };

  for (const id in areas) {
    const area = areas[id];
    if (area.is_town_area) state.towns[area.act] = area.id;
  }

  return state;
}

export interface RouteState {
  quests: Record<string, Quest>;
  areas: Record<string, Area>;
  towns: Record<Area["act"], Area["id"]>;
  bossWaypoints: Record<Monster["name"], Area["id"]>;
  waypoints: Set<Area["id"]>;
  currentAreaId: Area["id"];
  portalAreaId: Area["id"] | null;
}

function parseStep(text: string) {
  const regex = /(\s*#.*)|([^{]+)|\{(.+?)\}/g;

  let steps: Step = [];

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

type ActionEvaluator = (action: Action, state: RouteState) => boolean;
const actionEvaluators: Record<string, ActionEvaluator> = {
  kill: (action, state) => {
    if (action.length != 2) return false;
    const bossName = action[1];

    const currentArea = state.areas[state.currentAreaId];
    if (!currentArea.bosses.some((x) => x.name == bossName)) return false;

    const waypointUnlocks = state.bossWaypoints[bossName];
    if (waypointUnlocks) {
      for (const waypointUnlock of waypointUnlocks) {
        state.waypoints.add(waypointUnlock);
      }
    }

    return true;
  },
  area: (action, state) =>
    action.length == 2 && state.areas[action[1]] !== undefined,
  enter: (action, state) => {
    if (action.length != 2) return false;

    const area = state.areas[action[1]];
    if (!area) return false;
    if (!area.connection_ids.some((x) => x == state.currentAreaId))
      return false;

    if (area.is_town_area) state.waypoints.add(area.id);
    state.currentAreaId = area.id;
    return true;
  },
  town: (action, state) => {
    if (action.length != 1) return false;

    const area = state.areas[state.currentAreaId];
    if (!area) return false;

    state.currentAreaId = state.towns[area.act];
    return true;
  },
  waypoint: (action, state) => {
    if (action.length != 2) return false;

    const area = state.areas[action[1]];
    if (!area) return false;
    if (!state.waypoints.has(area.id)) return false;

    state.currentAreaId = area.id;
    return true;
  },
  get_waypoint: (action, state) => {
    if (action.length != 1) return false;

    const area = state.areas[state.currentAreaId];
    if (!area) return false;
    if (state.waypoints.has(area.id)) return false;
    if (!area.has_waypoint) return false;

    state.waypoints.add(area.id);
    return true;
  },
  set_portal: (action, state) => {
    if (action.length != 1) return false;

    state.portalAreaId = state.currentAreaId;
    return true;
  },
  use_portal: (action, state) => {
    if (action.length != 1) return false;
    if (!state.portalAreaId) return false;

    const currentArea = state.areas[state.currentAreaId];
    if (currentArea.id == state.portalAreaId) {
      const townId = state.towns[currentArea.act];
      state.portalAreaId = state.currentAreaId;
      state.currentAreaId = townId;
    } else {
      if (!currentArea.is_town_area) return false;
      state.currentAreaId = state.portalAreaId;
      state.portalAreaId = null;
    }

    return true;
  },
  quest: (action, state) =>
    action.length == 2 && state.quests[action[1]] !== undefined,
  quest_item: (action, state) => action.length == 2,
  vendor: (action, state) => action.length == 1,
  trial: (action, state) => action.length == 1,
};

function validateStep(step: Step, state: RouteState) {
  for (const subStep of step) {
    if (typeof subStep == "string") continue;
    if (subStep.length == 0) throw new Error(subStep.toString());

    const actionKey = subStep[0];
    const evaluator = actionEvaluators[actionKey];
    if (!evaluator) throw new Error(subStep.toString());
    try {
      const success = evaluator(subStep, state);
      if (!success) console.log(subStep.toString());
    } catch (e) {
      console.log(e);
    }
  }
}

export async function parseRoute(routePath: string, state: RouteState) {
  const fileStream = fs.createReadStream(routePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const steps: Step[] = [];
  for await (const line of rl) {
    if (!line) continue;

    const step = parseStep(line);
    validateStep(step, state);
    if (step.length > 0) steps.push(step);
  }
}
