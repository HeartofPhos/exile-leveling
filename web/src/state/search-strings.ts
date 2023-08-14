import { persistentStorageEffect } from ".";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { atom, selector } from "recoil";

const SEARCH_STRINGS_VERSION = 0;

export interface SearchString {
  text: string;
  alias?: string;
}

export const searchStringsAtom = atom<string[] | null>({
  key: "searchStringsAtom",
  default: getPersistent(
    "search-strings",
    SEARCH_STRINGS_VERSION,
    NO_MIGRATORS
  ),
  effects: [persistentStorageEffect("search-strings", SEARCH_STRINGS_VERSION)],
});

export const searchStringsSelector = selector({
  key: "searchStringsSelector",
  get: async ({ get }) => {
    const rawSearchStrings = get(searchStringsAtom);
    if (!rawSearchStrings) return null;

    let alias: string | undefined = undefined;
    let searchStrings: SearchString[] = [];
    for (let i = 0; i < rawSearchStrings.length; i++) {
      const line = rawSearchStrings[i];
      if (line.startsWith("#")) {
        alias = line.substring(1).trim();
      } else if (/\S/.test(line)) {
        searchStrings.push({
          text: line.trim(),
          alias: alias,
        });

        alias = undefined;
      }
    }

    return searchStrings;
  },
});
