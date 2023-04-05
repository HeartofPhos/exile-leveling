import { persistentStorageEffect } from ".";
import { RouteData } from "../../../common/route-processing/types";
import { getPersistent } from "../utility";
import { gemProgressKeys, gemProgressSelectorFamily } from "./gem-progress";
import { DefaultValue, atom, selector } from "recoil";

const GEM_LINKS_VERSION = 0;

const gemLinksAtom = atom<RouteData.GemLink[] | null>({
  key: "gemLinksAtom",
  default: getPersistent("gem-links", GEM_LINKS_VERSION),
  effects: [persistentStorageEffect("gem-links", GEM_LINKS_VERSION)],
});

export const gemLinksSelector = selector<RouteData.GemLink[]>({
  key: "gemLinksSelector",
  get: ({ get }) => {
    let gemLinks = get(gemLinksAtom);
    if (gemLinks === null) gemLinks = [];

    return gemLinks;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;
    set(gemLinksAtom, value);

    // for (const key of gemProgressKeys()) {
    //   const exists = value?.find((x) => x.uid == key) !== undefined;
    //   if (!exists) set(gemProgressSelectorFamily(key), false);
    // }
  },
});
