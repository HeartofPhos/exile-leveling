import { RESET } from "jotai/utils";
import { gemProgressFamily } from "./gem-progress";
import type { RouteData } from "common";
import { atom } from "jotai";
import { persistentAtom } from ".";

const REQUIRED_GEMS_VERSION = 0;

const requiredGemsAtom = persistentAtom<RouteData.RequiredGem[]>(
  "required-gems",
  [],
  REQUIRED_GEMS_VERSION,
);

export const requiredGemsSelector = atom(
  (get) => {
    return get(requiredGemsAtom);
  },
  (_get, set, newValue: RouteData.RequiredGem[] | typeof RESET) => {
    set(requiredGemsAtom, newValue);

    if (newValue === RESET) {
      set(gemProgressFamily.clear);
    }
  },
);
