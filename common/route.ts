import { Area, Monster, Quest } from "./types";

export type Action = string[];
export type Step = (string | Action)[];
export type Route = Step[];

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

const ERROR_INVALID_FORMAT = "invalid format";
const ERROR_MISSING_AREA = "area does not exist";
const ERROR_AREA_NO_WAYPOINT = "area does not have a waypoint";

type ActionEvaluator = (action: Action, state: RouteState) => null | string;
const actionEvaluators: Record<string, ActionEvaluator> = {
  kill: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;
    const bossName = action[1];

    // TODO data incomplete
    // const currentArea = state.areas[state.currentAreaId];
    // if (!currentArea.bosses.some((x) => x.name == bossName)) return false;

    const waypointUnlocks = state.bossWaypoints[bossName];
    if (waypointUnlocks) {
      for (const waypointUnlock of waypointUnlocks) {
        state.waypoints.add(waypointUnlock);
      }
    }

    return null;
  },
  area: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;

    const area = state.areas[action[1]];
    if (!area) return ERROR_MISSING_AREA;

    return null;
  },
  enter: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;

    const area = state.areas[action[1]];
    if (!area) return ERROR_MISSING_AREA;
    if (!area.connection_ids.some((x) => x == state.currentAreaId))
      return "not connected to current area";

    if (area.is_town_area && area.has_waypoint) state.waypoints.add(area.id);
    state.currentAreaId = area.id;
    return null;
  },
  town: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;

    const area = state.areas[state.currentAreaId];
    state.currentAreaId = state.towns[area.act];
    return null;
  },
  waypoint: (action, state) => {
    if (action.length == 1) return null;
    if (action.length != 2) return ERROR_INVALID_FORMAT;

    const area = state.areas[action[1]];
    if (!area) return ERROR_MISSING_AREA;
    if (!state.waypoints.has(area.id)) return "missing target waypoint";

    const currentArea = state.areas[state.currentAreaId];
    if (!currentArea.has_waypoint) return ERROR_AREA_NO_WAYPOINT;

    state.currentAreaId = area.id;
    return null;
  },
  get_waypoint: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;

    const area = state.areas[state.currentAreaId];
    if (!area) return ERROR_MISSING_AREA;
    if (!area.has_waypoint) return ERROR_AREA_NO_WAYPOINT;
    if (state.waypoints.has(area.id)) return "waypoint already acquired";

    state.waypoints.add(area.id);
    return null;
  },
  set_portal: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;

    state.portalAreaId = state.currentAreaId;
    return null;
  },
  use_portal: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;
    if (!state.portalAreaId) return "portal must be set";

    const currentArea = state.areas[state.currentAreaId];
    if (currentArea.id == state.portalAreaId) {
      const townId = state.towns[currentArea.act];
      state.portalAreaId = state.currentAreaId;
      state.currentAreaId = townId;
    } else {
      if (!currentArea.is_town_area)
        return "can only use portal from town or portal area";
      state.currentAreaId = state.portalAreaId;
      state.portalAreaId = null;
    }

    return null;
  },
  quest: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;

    // TODO data incomplete
    // const quest = state.quests[action[1]];
    // if (!quest) return false;

    return null;
  },
  quest_item: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;
    return null;
  },
  quest_text: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;
    return null;
  },
  talk: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;
    return null;
  },
  vendor: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;
    return null;
  },
  trial: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;
    return null;
  },
  crafting: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;
    return null;
  },
  ascend: (action, state) => {
    if (action.length != 1) return ERROR_INVALID_FORMAT;

    const expectedAreaId = "Labyrinth_Airlock";
    const currentArea = state.areas[state.currentAreaId];
    if (currentArea.id != expectedAreaId) {
      const expectedArea = state.areas[expectedAreaId];
      return `must be in "${expectedArea.name}"`;
    }

    return null;
  },
  dir: (action, state) => {
    if (action.length != 2) return ERROR_INVALID_FORMAT;

    const parsed = Number.parseFloat(action[1]);
    if (Number.isNaN(parsed)) return "dir value is not a number";

    let dir = parsed % 360;
    if (dir < 0) dir += 360;

    if (dir % 45 != 0) return "dir value must be in intervals of 45";

    return null;
  },
};

export function validateStep(step: Step, state: RouteState) {
  for (const subStep of step) {
    if (typeof subStep == "string") continue;
    if (subStep.length == 0) throw new Error(subStep.toString());

    const actionKey = subStep[0];
    const evaluator = actionEvaluators[actionKey];
    if (!evaluator) throw new Error(subStep.toString());

    const error = evaluator(subStep, state);
    if (error) console.log(`${subStep.toString()}: ${error}`);
  }
}

export function validateRoute(
  route: Route,
  quests: Record<string, Quest>,
  areas: Record<string, Area>,
  bossWaypoints: Record<Monster["name"], Area["id"]>
) {
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

  for (const step of route) {
    validateStep(step, state);
  }
}

export async function parseRoute(routeData: string) {
  const routeLines = routeData.split(/(?:\r\n|\r|\n)/g);
  console.log(routeLines);

  const route: Route = [];
  for await (const line of routeLines) {
    if (!line) continue;

    const step = parseStep(line);
    if (step.length > 0) route.push(step);
  }

  return route;
}
