import { NO_MIGRATORS, clearPersistent, getPersistent, setPersistent } from "../utility";
import { atomFamily, selectorFamily, useRecoilCallback } from "recoil";

const GEM_PROGRESS_VERSION = 1;

const gemProgress = new Set<string>(
  getPersistent<string[]>("gem-progress", GEM_PROGRESS_VERSION, NO_MIGRATORS)
);

const gemProgressAtomFamily = atomFamily<boolean, string>({
  key: "gemProgressAtomFamily",
  default: (param) => gemProgress.has(param),
});

export const gemProgressSelectorFamily = selectorFamily<boolean, string>({
  key: "gemProgressSelectorFamily",
  get:
    (param) =>
    ({ get }) => {
      const gemProgressAtom = get(gemProgressAtomFamily(param));
      return gemProgressAtom;
    },
  set:
    (param) =>
    ({ set }, newValue) => {
      set(gemProgressAtomFamily(param), newValue);

      if (newValue) gemProgress.add(param);
      else gemProgress.delete(param);

      if (gemProgress.size > 0)
        setPersistent("gem-progress", GEM_PROGRESS_VERSION, [...gemProgress]);
      else clearPersistent("gem-progress");
    },
});

export const gemProgressKeys = () => gemProgress.keys();

export function useClearGemProgress() {
  return useRecoilCallback(
    ({ set }) =>
      () => {
        for (const key of gemProgress.keys()) {
          set(gemProgressSelectorFamily(key), false);
        }
      },
    []
  );
}
