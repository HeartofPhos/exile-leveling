import { DefaultValue } from "recoil";
import { atom, selector } from "recoil";
import { persistentStorageEffect } from ".";
import type { BuildData } from "../../../common/route-processing";
import { gemProgressKeys, gemProgressSelectorFamily } from "./gem-progress";

const buildDataAtom = atom<BuildData | null>({
  key: "buildDataAtom",
  default: null,
  effects: [persistentStorageEffect("build-data")],
});
export const buildDataSelector = selector<BuildData>({
  key: "buildDataSelector",
  get: ({ get }) => {
    let buildData = get(buildDataAtom);
    if (buildData === null)
      buildData = {
        characterClass: "None",
        bandit: "None",
        leagueStart: true,
        requiredGems: [],
      };

    return buildData;
  },
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(buildDataAtom);
      return;
    }

    set(buildDataAtom, newValue);

    for (const key of gemProgressKeys()) {
      const exists =
        newValue?.requiredGems.find((x) => x.uid == key) !== undefined;

      if (!exists) set(gemProgressSelectorFamily(key), false);
    }
  },
});
