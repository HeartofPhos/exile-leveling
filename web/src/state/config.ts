import { atomWithStorage } from "jotai/utils";
import { versionedStorage } from ".";

export interface Config {
  gemsOnly: boolean;
  showSubsteps: boolean;
}

const CONFIG_VERSION = 0;

export const configSelector = atomWithStorage<Config>(
  "config",
  {
    gemsOnly: false,
    showSubsteps: true,
  },
  versionedStorage(CONFIG_VERSION),
);
