import { persistentAtom } from ".";

export interface Config {
  gemsOnly: boolean;
  showSubsteps: boolean;
}

const CONFIG_VERSION = 0;

export const configSelector = persistentAtom<Config>(
  "config",
  {
    gemsOnly: false,
    showSubsteps: true,
  },
  CONFIG_VERSION,
);
