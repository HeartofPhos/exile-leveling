import { persistentAtom } from ".";

const POB_CODE_VERSION = 0;

export const pobCodeAtom = persistentAtom<string | null>(
  "pob-code",
  null,
  POB_CODE_VERSION,
);
