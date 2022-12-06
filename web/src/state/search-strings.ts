import { atom } from "recoil";
import { persistentStorageEffect } from ".";
import { getPersistent } from "../utility";

export const searchStringsAtom = atom<string[] | null>({
  key: "searchStringsAtom",
  default: getPersistent("search-strings"),
  effects: [persistentStorageEffect("search-strings")],
});
