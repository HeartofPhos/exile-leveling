import { atom } from "recoil";
import { persistentStorageEffect } from ".";
import { getPersistent } from "../utility";

const SEARCH_STRINGS_VERSION = 0;

export const searchStringsAtom = atom<string[] | null>({
  key: "searchStringsAtom",
  default: getPersistent("search-strings", SEARCH_STRINGS_VERSION),
  effects: [persistentStorageEffect("search-strings", SEARCH_STRINGS_VERSION)],
});
