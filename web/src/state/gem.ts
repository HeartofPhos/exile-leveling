import { persistentStorageEffect } from ".";
import { RouteData } from "../../../common/route-processing/types";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { gemProgressKeys, gemProgressSelectorFamily } from "./gem-progress";
import { DefaultValue, atom, selector } from "recoil";

const REQUIRED_GEMS_VERSION = 0;

const requiredGemsAtom = atom<RouteData.RequiredGem[] | null>({
  key: "requiredGemsAtom",
  default: getPersistent("required-gems", REQUIRED_GEMS_VERSION, NO_MIGRATORS),
  effects: [persistentStorageEffect("required-gems", REQUIRED_GEMS_VERSION)],
});

export const requiredGemsSelector = selector<RouteData.RequiredGem[]>({
  key: "requiredGemsSelector",
  get: ({ get }) => {
    let requiredGems = get(requiredGemsAtom);
    if (requiredGems === null) requiredGems = [];

    return requiredGems;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;
    set(requiredGemsAtom, value);

    for (const key of gemProgressKeys()) {
      const exists = value?.find((x) => x.id == key) !== undefined;
      if (!exists) set(gemProgressSelectorFamily(key), false);
    }
  },
});
