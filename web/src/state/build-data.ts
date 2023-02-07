import { DefaultValue } from "recoil";
import { atom, selector } from "recoil";
import { persistentStorageEffect } from ".";
import type { BuildData } from "../../../common/route-processing";
import { getPersistent } from "../utility";
import { gemProgressKeys, gemProgressSelectorFamily } from "./gem-progress";

const BUILD_DATA_VERSION = 3;

const buildDataAtom = atom<BuildData | null>({
  key: "buildDataAtom",
  default: getPersistent("build-data", BUILD_DATA_VERSION),
  effects: [persistentStorageEffect("build-data", BUILD_DATA_VERSION)],
});
export const buildDataSelector = selector<BuildData>({
  key: "buildDataSelector",
  get: ({ get }) => {
    let value = get(buildDataAtom);
    if (value === null)
      value = {
        characterClass: "None",
        bandit: "None",
        leagueStart: true,
        library: true,
      };

    return value;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;
    set(buildDataAtom, value);
  },
});
