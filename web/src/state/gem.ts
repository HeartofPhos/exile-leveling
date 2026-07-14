import { persistentStorageEffect } from ".";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { gemProgressFamily, gemProgressKeys } from "./gem-progress";
import { RouteData } from "common";
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
      if (!exists) set(gemProgressFamily(key), false);
    }
  },
});
