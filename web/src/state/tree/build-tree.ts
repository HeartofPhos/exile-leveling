import { atom, selector, DefaultValue } from "recoil";
import { persistentStorageEffect } from "..";
import { BuildTree } from "../../../../common/route-processing/types";
import { getPersistent } from "../../utility";

const BUILD_PASSIVE_TREES_VERSION = 0;

const buildTreesAtom = atom<BuildTree[] | null>({
  key: "buildTreesAtom",
  default: getPersistent("build-trees", BUILD_PASSIVE_TREES_VERSION),
  effects: [
    persistentStorageEffect("build-trees", BUILD_PASSIVE_TREES_VERSION),
  ],
});

export const buildTreesSelector = selector<BuildTree[]>({
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
