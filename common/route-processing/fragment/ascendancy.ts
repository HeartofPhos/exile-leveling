import { RouteState } from "..";
import {
  ERROR_INVALID_FORMAT,
  EvaluateResult,
  RawFragment,
  transitionArea,
} from ".";
import { areas } from "../../data";

export interface TrialFragment {
  type: "trial";
}

export interface AscendFragment {
  type: "ascend";
  version: "normal" | "cruel" | "merciless" | "eternal";
}

export function EvaluateTrial(
  rawFragment: RawFragment,
  state: RouteState
): EvaluateResult {
  if (rawFragment.length != 1) throw ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "trial",
    },
  };
}

export function EvaluateAscend(
  rawFragment: RawFragment,
  state: RouteState
): EvaluateResult {
  if (rawFragment.length != 2) throw ERROR_INVALID_FORMAT;

  const expectedAreaId = "Labyrinth_Airlock";
  const currentArea = areas[state.currentAreaId];
  if (currentArea.id != expectedAreaId) {
    const expectedArea = areas[expectedAreaId];
    state.logger.warn(`must be in "${expectedArea.name}"`);
  }

  const townArea = areas[state.lastTownAreaId];
  transitionArea(state, townArea);

  return {
    fragment: {
      type: "ascend",
      //@ts-expect-error
      version: rawFragment[1],
    },
  };
}
