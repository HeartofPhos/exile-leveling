import { atom } from "recoil";
import { persistentStorageEffect } from ".";

export const vendorStringsAtom = atom<string[] | null>({
  key: "vendorStringsAtom",
  default: null,
  effects: [persistentStorageEffect("vendor-strings")],
});
