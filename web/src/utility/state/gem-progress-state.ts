import { atomFamily, selectorFamily, useRecoilCallback } from "recoil";
import { clearPersistent, getPersistent, setPersistent } from "..";

const gemProgress = new Set<number>(getPersistent<number[]>("gem-progress"));

const gemProgressAtomFamily = atomFamily<boolean, number>({
  key: "gemProgressAtomFamily",
  default: (param) => gemProgress.has(param),
});

export const gemProgressSelectorFamily = selectorFamily<boolean, number>({
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

      if (gemProgress.size > 0) setPersistent("gem-progress", [...gemProgress]);
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
