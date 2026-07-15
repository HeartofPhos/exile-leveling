import type { Setter } from "jotai";
import {
  clearPersistent,
  getPersistent,
  NO_MIGRATORS,
  setPersistent,
} from "../utility";
import { atom, type WritableAtom } from "jotai";
import { atomFamily } from "jotai-family";

export const buildToggleState = (
  version: number,
  key: string,
): [
  (key: string) => WritableAtom<boolean, [newValue: boolean], void>,
  (set: Setter) => void,
] => {
  const toggleState = new Set<string>(
    getPersistent<string[]>(key, version, NO_MIGRATORS),
  );

  const refreshAtom = atom(0);
  function refresh(set: Setter) {
    set(refreshAtom, (prev) => prev + 1);
  }

  const toggleFamily = atomFamily((param: string) =>
    atom(
      (get) => {
        get(refreshAtom);
        return toggleState.has(param);
      },
      (_get, set, newValue: boolean) => {
        if (newValue) toggleState.add(param);
        else toggleState.delete(param);

        if (toggleState.size > 0) setPersistent(key, version, [...toggleState]);
        else clearPersistent(key);

        refresh(set);
      },
    ),
  );

  const clearToggle = (set: Setter) => {
    toggleState.clear();
    setPersistent(key, version, null);

    refresh(set);
  };

  return [toggleFamily, clearToggle];
};
