import { persistentStorageEffect } from "..";
import { RouteData } from "../../../../common/route-processing/types";
import { getPersistent } from "../../utility";
import { DefaultValue, atom, selector } from "recoil";

const BUILD_PASSIVE_TREES_VERSION = 0;

const buildTreesAtom = atom<RouteData.BuildTree[] | null>({
  key: "buildTreesAtom",
  default: getPersistent("build-trees", BUILD_PASSIVE_TREES_VERSION, {}),
  effects: [
    persistentStorageEffect("build-trees", BUILD_PASSIVE_TREES_VERSION),
  ],
});

export const buildTreesSelector = selector<RouteData.BuildTree[]>({
  key: "buildTreesSelector",
  get: ({ get }) => {
    let value = get(buildTreesAtom);
    if (value === null) value = [];

    return value;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;
    set(buildTreesAtom, value);
  },
});
