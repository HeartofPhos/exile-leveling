import {
  ERROR_INVALID_FORMAT,
  EvaluateResult,
  RawFragment,
  RouteLookup,
  RouteState,
  transitionArea,
} from ".";
import { areas } from "../data";

export interface TrialFragment {
  type: "trial";
}

export function EvaluateTrial(
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

const GUIDE_URL_LOOKUP: Record<string, string> = {
  normal: "https://www.poelab.com/gtgax",
  cruel: "https://www.poelab.com/r8aws",
  merciless: "https://www.poelab.com/riikv",
  eternal: "https://www.poelab.com/wfbra",
};

export interface AscendFragment {
  type: "ascend";
  guideUrl: string;
}

export function EvaluateAscend(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;

  const expectedAreaId = "Labyrinth_Airlock";
  const currentArea = areas[state.currentAreaId];
  if (currentArea.id != expectedAreaId) {
    const expectedArea = areas[expectedAreaId];
    return `must be in "${expectedArea.name}"`;
  }

  const townArea = areas[state.lastTownAreaId];
  transitionArea(lookup, state, townArea);

  return {
    fragment: {
      type: "ascend",
      guideUrl: GUIDE_URL_LOOKUP[rawFragment[1]],
    },
  };
}
