import { atom, DefaultValue, selector } from "recoil";
import { persistentStorageEffect } from ".";
import { RequiredGem } from "../../../common/route-processing";
import { getPersistent } from "../utility";
import { gemProgressKeys, gemProgressSelectorFamily } from "./gem-progress";

const REQUIRED_GEMS_VERSION = 0;

const requiredGemsAtom = atom<RequiredGem[] | null>({
  key: "requiredGemsAtom",
  default: getPersistent("required-gems", REQUIRED_GEMS_VERSION),
  effects: [persistentStorageEffect("required-gems", REQUIRED_GEMS_VERSION)],
});

export const requiredGemsSelector = selector<RequiredGem[]>({
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
      const exists = value?.find((x) => x.uid == key) !== undefined;
      if (!exists) set(gemProgressSelectorFamily(key), false);
    }
  },
});
