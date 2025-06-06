import { persistentStorageEffect } from ".";
import { RouteData } from "../../../common/route-processing/types";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { DefaultValue } from "recoil";
import { atom, selector } from "recoil";

const BUILD_DATA_VERSION = 3;

const buildDataAtom = atom<RouteData.BuildData | null>({
  key: "buildDataAtom",
  default: getPersistent("build-data", BUILD_DATA_VERSION, NO_MIGRATORS),
  effects: [persistentStorageEffect("build-data", BUILD_DATA_VERSION)],
});

export const buildDataSelector = selector<RouteData.BuildData>({
  key: "buildDataSelector",
  get: ({ get }) => {
    let value = get(buildDataAtom);
    if (value === null)
      value = {
        characterClass: "None",
        bandit: "Alira",
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
