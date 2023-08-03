import { Data } from "../data";
import { GameData } from "../types";
import { parseFragment } from "./fragment";
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
}

interface ParseContext {
  state: RouteState;
  section: RouteData.Section;
  conditionalStack: boolean[];
  logger: ScopedLogger;
}

const ROUTE_PATTERNS: Pattern<ParseContext>[] = [
  // endif
  {
    regex: /^( *)#endif/g,
    processor: (match, { conditionalStack, logger }) => {
      const [, padding] = match;

      const value = conditionalStack.pop();
      if (value === undefined) logger.warn("unexpected #endif");

      assertPadding(padding, conditionalStack.length, logger);

      return false;
    },
  },
  // ifdef
  {
    regex: /^( *)#ifdef *(.*)/g,
    processor: (match, { state, conditionalStack, logger }) => {
      const [, padding, value] = match;

      assertPadding(padding, conditionalStack.length, logger);

      if (value)
        conditionalStack.push(state.preprocessorDefinitions.has(value));

      return false;
    },
  },
  // ifndef
  {
    regex: /^( *)#ifndef *(.*)/g,
    processor: (match, { state, conditionalStack, logger }) => {
      const [, padding, value] = match;

      assertPadding(padding, conditionalStack.length, logger);

      if (value)
        conditionalStack.push(!state.preprocessorDefinitions.has(value));

      return false;
    },
  },
  // StepHint
  {
    regex: /^( *)#hint *(.*)/g,
    processor: (match, { state, section, conditionalStack, logger }) => {
      const evaluateLine =
        conditionalStack.length == 0 ||
        conditionalStack[conditionalStack.length - 1];
      if (!evaluateLine) return false;

      const [, padding, value] = match;
      assertPadding(padding, conditionalStack.length + 1, logger);

      const prevStep =
        section.steps.length > 0
          ? section.steps[section.steps.length - 1]
          : null;

      if (prevStep === null) {
        logger.warn("hint expected step");
        return false;
      }

      if (prevStep.type !== "fragment_step") {
        logger.warn("hint expected fragment_step");
        return false;
      }

      const fragments = parseFragment(value.trim(), state, logger);
      if (fragments.length > 0) prevStep.hints.push(fragments);

      return false;
    },
  },
  // FragmentStep
  {
    regex: /^( *)(.*)/g,
    processor: (match, { state, section, conditionalStack, logger }) => {
      const evaluateLine =
        conditionalStack.length == 0 ||
        conditionalStack[conditionalStack.length - 1];
      if (!evaluateLine) return false;

      const [, padding, value] = match;
      assertPadding(padding, conditionalStack.length, logger);

      const fragments = parseFragment(value.trim(), state, logger);
      if (fragments.length > 0)
        section.steps.push({
          type: "fragment_step",
          parts: fragments,
          hints: [],
        });

      return false;
    },
  },
];

function assertPadding(text: string, depth: number, logger: ScopedLogger) {
  const expectedPadding = depth * 4;

  let actualPadding = 0;
  const match = /^( *)/g.exec(text);
  if (match) actualPadding = match[1].length;

  if (actualPadding !== expectedPadding)
    logger.warn(
      `expected ${expectedPadding} whitespace, found ${actualPadding}`
    );
}

export function parseRoute(
  routeFiles: RouteData.RouteFile[],
  state: RouteState
) {
  const logger = new ScopedLogger();

  const route: RouteData.Route = [];
  for (const routeFile of routeFiles) {
    const routeLines = routeFile.contents.split(/\r\n|\r|\n/g);

    const section: RouteData.Section = {
      name: routeFile.name,
      steps: [],
    };
    route.push(section);

    logger.pushScope(section.name);

    const context: ParseContext = {
      state,
      section,
      conditionalStack: [],
      logger,
    };

    for (let lineIndex = 0; lineIndex < routeLines.length; lineIndex++) {
      const line = routeLines[lineIndex];
      if (!line) continue;

      logger.pushScope(`line ${lineIndex + 1}`);
      matchPatterns(line, ROUTE_PATTERNS, context);
      logger.popScope();
    }

    if (context.conditionalStack.length != 0) logger.warn("expected #endif");

    logger.popScope();
  }

  for (const waypoint of state.explicitWaypoints) {
    if (!state.usedWaypoints.has(waypoint)) {
      logger.warn(`unused waypoint ${waypoint}`);
    }
  }

  for (const key in Data.Areas) {
    const area = Data.Areas[key];
    if (area.crafting_recipes.length > 0 && !state.craftingAreas.has(area.id))
      logger.warn(
        `missing crafting area ${area.id}, ${area.crafting_recipes.join(", ")}`
      );
  }

  logger.drain(console);

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
  };

  return state;
}
