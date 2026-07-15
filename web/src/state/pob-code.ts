import { atomWithStorage } from "jotai/utils";
import { versionedStorage } from ".";

const POB_CODE_VERSION = 0;

export const pobCodeAtom = atomWithStorage<string | null>(
  "pob-code",
  null,
  versionedStorage(POB_CODE_VERSION),
);
