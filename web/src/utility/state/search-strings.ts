import { atom } from "recoil";
import { persistentStorageEffect } from ".";

export const searchStringsAtom = atom<string[] | null>({
  key: "searchStringsAtom",
  default: null,
  effects: [persistentStorageEffect("search-strings")],
});
