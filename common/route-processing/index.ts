import { Area } from "../types";
import { areas } from "../data";
import { FragmentStep, parseFragmentStep } from "./fragment";
import { GemStep } from "./gems";
import { ScopedLogger } from "./scoped-logger";

export type Step = FragmentStep | GemStep;
export interface Section {
  name: string;
  steps: Step[];
}
export type Route = Section[];

export interface RouteFile {
  name: string;
  contents: string;
}

export function getRouteFiles(routeSources: string[]) {
  const routeFiles: RouteFile[] = [];
  for (const routeSource of routeSources) {
    const routeLines = routeSource.split(/(?:\r\n|\r|\n)/g);

    for (let lineIndex = 0; lineIndex < routeLines.length; lineIndex++) {
      const line = routeLines[lineIndex];

      const sectionRegex = /^#section\s*(.*)/g;
      const sectionMatch = sectionRegex.exec(line);
      if (sectionMatch) {
        const sectionName = sectionMatch[1];
        routeFiles.push({
          name: sectionName,
          contents: "",
        });
      } else if (routeFiles.length == 0) {
        routeFiles.push({ name: "Missing Section Name", contents: "" });
      } else {
        const workingFile = routeFiles[routeFiles.length - 1];
        if (workingFile.contents !== "") workingFile.contents += "\n";
        workingFile.contents += line;
      }
    }
  }

  return routeFiles;
}

export interface RouteState {
  implicitWaypoints: Set<Area["id"]>;
  explicitWaypoints: Set<Area["id"]>;
  usedWaypoints: Set<Area["id"]>;
  craftingAreas: Set<Area["id"]>;
  currentAreaId: Area["id"];
  lastTownAreaId: Area["id"];
  portalAreaId: Area["id"] | null;
  preprocessorDefinitions: Set<string>;
  logger: ScopedLogger;
}

export function parseRoute(routeFiles: RouteFile[], state: RouteState) {
  const route: Route = [];
  for (const routeFile of routeFiles) {
    const routeLines = routeFile.contents.split(/(?:\r\n|\r|\n)/g);

    const section: Section = { name: routeFile.name, steps: [] };
    route.push(section);

    state.logger.pushScope(section.name);

    const conditionalStack: boolean[] = [];
    for (let lineIndex = 0; lineIndex < routeLines.length; lineIndex++) {
      const line = routeLines[lineIndex];
      if (!line) continue;

      state.logger.withScope(`line ${lineIndex + 1}`, () => {
        const endifRegex = /^\s*#endif/g;
        const endifMatch = endifRegex.exec(line);

        if (endifMatch) {
          const value = conditionalStack.pop();
          if (value === undefined) state.logger.warn("unexpected #endif");
          return;
        }

        const evaluateLine =
          conditionalStack.length == 0 ||
          conditionalStack[conditionalStack.length - 1];
        if (!evaluateLine) return;

        const ifdefRegex = /^\s*#ifdef\s+(\w+)/g;
        const ifdefMatch = ifdefRegex.exec(line);
        if (ifdefMatch) {
          const value = ifdefMatch[1];
          conditionalStack.push(state.preprocessorDefinitions.has(value));
          return;
        }

        const step = parseFragmentStep(line, state);
        if (step.parts.length > 0) section.steps.push(step);
      });
    }

    if (conditionalStack.length != 0) state.logger.warn("expected #endif");

    state.logger.popScope();
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

  return route;
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
  uid: string;
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
    preprocessorDefinitions: new Set(),
    logger: new ScopedLogger(),
  };

  return state;
}
