import { areas } from "../data";
import { GameData } from "../types";
import { parseFragmentStep } from "./fragment";
import { Pattern, matchPatterns } from "./patterns";
import { ScopedLogger } from "./scoped-logger";
import { RouteData } from "./types";

const DEFAULT_SECTION_NAME = "Default";

export function getRouteFiles(routeSources: string[]) {
  const routeFiles: RouteData.RouteFile[] = [];
  for (const routeSource of routeSources) {
    const routeLines = routeSource.split(/\r\n|\r|\n/g);

    for (let lineIndex = 0; lineIndex < routeLines.length; lineIndex++) {
      const line = routeLines[lineIndex];

      const sectionRegex = /^ *#section *(.*)/g;
      const sectionMatch = sectionRegex.exec(line);
      if (sectionMatch) {
        const sectionName = sectionMatch[1] || DEFAULT_SECTION_NAME;

        routeFiles.push({
          name: sectionName,
          contents: `#section ${sectionName}`,
        });

        continue;
      }

      if (routeFiles.length == 0) {
        routeFiles.push({
          name: DEFAULT_SECTION_NAME,
          contents: `#section ${DEFAULT_SECTION_NAME}`,
        });
      }

      const workingFile = routeFiles[routeFiles.length - 1];
      workingFile.contents += `\n${line}`;
    }
  }

  return routeFiles;
}

export function buildRouteSource(routeFiles: RouteData.RouteFile[]) {
  return routeFiles.map((x) => x.contents).join("\n");
}

export interface RouteState {
  implicitWaypoints: Set<GameData.Area["id"]>;
  explicitWaypoints: Set<GameData.Area["id"]>;
  usedWaypoints: Set<GameData.Area["id"]>;
  craftingAreas: Set<GameData.Area["id"]>;
  currentAreaId: GameData.Area["id"];
  lastTownAreaId: GameData.Area["id"];
  portalAreaId: GameData.Area["id"] | null;
  preprocessorDefinitions: Set<string>;
  logger: ScopedLogger;
}

interface ParseContext {
  state: RouteState;
  section: RouteData.Section;
  conditionalStack: boolean[];
}

const ROUTE_PATTERNS: Pattern<ParseContext>[] = [
  // endif
  {
    regex: /^ *#endif/g,
    processor: (match, { state, conditionalStack }) => {
      const value = conditionalStack.pop();
      if (value === undefined) state.logger.warn("unexpected #endif");

      return false;
    },
  },
  // ifdef
  {
    regex: /^ *#ifdef *(.*)/g,
    processor: (match, { state, conditionalStack }) => {
      const value = match[1];
      if (value)
        conditionalStack.push(state.preprocessorDefinitions.has(value));

      return false;
    },
  },
  // ifndef
  {
    regex: /^ *#ifndef *(.*)/g,
    processor: (match, { state, conditionalStack }) => {
      const value = match[1];
      if (value)
        conditionalStack.push(!state.preprocessorDefinitions.has(value));

      return false;
    },
  },
  // FragmentStep
  {
    regex: /.*/g,
    processor: (match, { state, section, conditionalStack }) => {
      const evaluateLine =
        conditionalStack.length == 0 ||
        conditionalStack[conditionalStack.length - 1];

      if (evaluateLine) {
        const step = parseFragmentStep(match[0], state);
        if (step.parts.length > 0) section.steps.push(step);
      }

      return false;
    },
  },
];

export function parseRoute(
  routeFiles: RouteData.RouteFile[],
  state: RouteState
) {
  const route: RouteData.Route = [];
  for (const routeFile of routeFiles) {
    const routeLines = routeFile.contents.split(/\r\n|\r|\n/g);

    const section: RouteData.Section = {
      name: routeFile.name,
      steps: [],
    };
    route.push(section);

    state.logger.pushScope(section.name);

    const parseContext: ParseContext = {
      state,
      section,
      conditionalStack: [],
    };

    for (let lineIndex = 0; lineIndex < routeLines.length; lineIndex++) {
      const line = routeLines[lineIndex];
      if (!line) continue;

      state.logger.pushScope(`line ${lineIndex + 1}`);
      matchPatterns(line, ROUTE_PATTERNS, parseContext);
      state.logger.popScope();
    }

    if (parseContext.conditionalStack.length != 0)
      state.logger.warn("expected #endif");

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
