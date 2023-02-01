import { DefaultValue } from "recoil";
import { atom, selector } from "recoil";
import { persistentStorageEffect } from ".";
import type { BuildData } from "../../../common/route-processing";
import { getPersistent } from "../utility";
import { gemProgressKeys, gemProgressSelectorFamily } from "./gem-progress";

const BUILD_DATA_VERSION = 2;

const buildDataAtom = atom<BuildData | null>({
  key: "buildDataAtom",
  default: getPersistent("build-data", BUILD_DATA_VERSION),
  effects: [persistentStorageEffect("build-data", BUILD_DATA_VERSION)],
});
export const buildDataSelector = selector<BuildData>({
  key: "buildDataSelector",
  get: ({ get }) => {
    let buildData = get(buildDataAtom);
    if (buildData === null)
      buildData = {
        characterClass: "None",
        requiredGems: [],
        bandit: "None",
        leagueStart: true,
        library: true,
      };

    return buildData;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;

    set(buildDataAtom, value);

    for (const key of gemProgressKeys()) {
      const exists =
        value?.requiredGems.find((x) => x.uid == key) !== undefined;

      if (!exists) set(gemProgressSelectorFamily(key), false);
    }
  },
});
