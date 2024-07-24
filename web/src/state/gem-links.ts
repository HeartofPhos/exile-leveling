import { persistentStorageEffect } from ".";
import { RouteData } from "../../../common/route-processing/types";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { DefaultValue, atom, selector } from "recoil";

const GEM_LINKS_VERSION = 0;

const gemLinksAtom = atom<RouteData.GemLinkGroup[] | null>({
  key: "gemLinksAtom",
  default: getPersistent("gem-links", GEM_LINKS_VERSION, NO_MIGRATORS),
  effects: [persistentStorageEffect("gem-links", GEM_LINKS_VERSION)],
});

export const gemLinksSelector = selector<RouteData.GemLinkGroup[]>({
  key: "gemLinksSelector",
  get: ({ get }) => {
    let gemLinks = get(gemLinksAtom);
    if (gemLinks === null) gemLinks = [];

    return gemLinks;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;
    set(gemLinksAtom, value);
  },
});
