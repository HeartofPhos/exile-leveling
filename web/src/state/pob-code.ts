import { persistentStorageEffect } from ".";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { atom } from "recoil";

const POB_CODE_PROGRESS_VERSION = 0;

export const pobCodeAtom = atom<string | null>({
  key: "pobCodeAtom",
  default: getPersistent("pob-code", POB_CODE_PROGRESS_VERSION, NO_MIGRATORS),
  effects: [persistentStorageEffect("pob-code", POB_CODE_PROGRESS_VERSION)],
});
