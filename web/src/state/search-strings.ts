import { persistentStorageEffect } from ".";
import { BuildMigratorMap, getPersistent } from "../utility";
import { atom } from "recoil";

const SEARCH_STRINGS_VERSION = 0;

const MIGRATORS = BuildMigratorMap([
  [0, 1, (old: string[]) => old.map((x) => "#" + x)],
  [1, 2, (old: string[]) => old.map((x) => "!" + x)],
]);

export const searchStringsAtom = atom<string[] | null>({
  key: "searchStringsAtom",
  default: getPersistent("search-strings", SEARCH_STRINGS_VERSION, MIGRATORS),
  effects: [persistentStorageEffect("search-strings", SEARCH_STRINGS_VERSION)],
});
