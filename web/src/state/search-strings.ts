import { persistentStorageEffect } from ".";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { atom } from "recoil";

const SEARCH_STRINGS_VERSION = 0;

export const searchStringsAtom = atom<string[] | null>({
  key: "searchStringsAtom",
  default: getPersistent(
    "search-strings",
    SEARCH_STRINGS_VERSION,
    NO_MIGRATORS
  ),
  effects: [persistentStorageEffect("search-strings", SEARCH_STRINGS_VERSION)],
});
