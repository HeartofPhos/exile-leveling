import { DefaultValue } from "recoil";
import { atom, selector } from "recoil";
import { persistentStorageEffect } from ".";
import type { BuildData } from "../../../common/route-processing";
import { getPersistent } from "../utility";
import { gemProgressKeys, gemProgressSelectorFamily } from "./gem-progress";

const buildDataAtom = atom<BuildData | null>({
  key: "buildDataAtom",
  default: getPersistent("build-data"),
  effects: [persistentStorageEffect("build-data")],
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
        passiveTrees: [],
        leagueStart: true,
        library: true,
      };

    return buildData;
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) {
      set(buildDataAtom, null);
    } else {
      set(buildDataAtom, newValue);

      for (const key of gemProgressKeys()) {
        const exists =
          newValue?.requiredGems.find((x) => x.uid == key) !== undefined;

        if (!exists) set(gemProgressSelectorFamily(key), false);
      }
    }
  },
});
