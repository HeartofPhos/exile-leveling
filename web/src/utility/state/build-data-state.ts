import { DefaultValue } from "recoil";
import { atom, selector } from "recoil";
import { persistentStorageEffect } from ".";
import type { BuildData } from "../../../../common/route-processing";
import {
  gemProgressKeys,
  gemProgressSelectorFamily,
} from "./gem-progress-state";
const buildDataAtom = atom<BuildData | null>({
  key: "buildDataAtom",
  default: null,
  effects: [persistentStorageEffect("build-data")],
});
export const buildDataSelector = selector<BuildData | null>({
  key: "buildDataSelector",
  get: ({ get }) => {
    return get(buildDataAtom);
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return;

    set(buildDataAtom, newValue);

    for (const key of gemProgressKeys()) {
      const exists =
        newValue?.requiredGems.find((x) => x.uid == key) !== undefined;

      if (!exists) set(gemProgressSelectorFamily(key), false);
    }
  },
});
