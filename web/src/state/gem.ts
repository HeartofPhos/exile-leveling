import { atomWithStorage, RESET } from "jotai/utils";
import { clearGemProgress } from "./gem-progress";
import type { RouteData } from "common";
import { atom } from "jotai";
import { versionedStorage } from ".";

const REQUIRED_GEMS_VERSION = 0;

const requiredGemsAtom = atomWithStorage<RouteData.RequiredGem[]>(
  "required-gems",
  [],
  versionedStorage(REQUIRED_GEMS_VERSION),
);

export const requiredGemsSelector = atom(
  (get) => {
    return get(requiredGemsAtom);
  },
  (_get, set, newValue: RouteData.RequiredGem[] | typeof RESET) => {
    set(requiredGemsAtom, newValue);

    if (newValue === RESET) {
      clearGemProgress(set);
    }
  },
);
