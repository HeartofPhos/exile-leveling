import { persistentStorageEffect } from ".";
import { NO_MIGRATORS, getPersistent } from "../utility";
import { DefaultValue } from "recoil";
import { atom, selector } from "recoil";

export interface Config {
  gemsOnly: boolean;
  showSubsteps: boolean;
}

const CONFIG_VERSION = 0;

const configAtom = atom<Config | null>({
  key: "configAtom",
  default: getPersistent("config", CONFIG_VERSION, NO_MIGRATORS),
  effects: [persistentStorageEffect("config", CONFIG_VERSION)],
});

export const configSelector = selector<Config>({
  key: "configSelector",
  get: ({ get }) => {
    let value = get(configAtom);
    if (value === null)
      value = {
        gemsOnly: false,
        showSubsteps: true,
      };

    return value;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;
    set(configAtom, value);
  },
});
