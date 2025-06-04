import {
  NO_MIGRATORS,
  clearPersistent,
  getPersistent,
  setPersistent,
} from "../utility";
import {
  RecoilState,
  atomFamily,
  selectorFamily,
  useRecoilCallback,
} from "recoil";

export const buildToggleState = (
  version: number,
  key: string
): [
  (param: string) => RecoilState<boolean>,
  () => Iterable<string>,
  () => () => void
] => {
  const toggleState = new Set<string>(
    getPersistent<string[]>(key, version, NO_MIGRATORS)
  );

  const toggleAtomFamily = atomFamily<boolean, string>({
    key: `${key} toggleAtomFamily`,
    default: (param) => toggleState.has(param),
  });

  const toggleCollapsedSelectorFamily = selectorFamily<boolean, string>({
    key: `${key} toggleCollapsedSelectorFamily`,
    get:
      (param) =>
      ({ get }) => {
        const toggleAtom = get(toggleAtomFamily(param));
        return toggleAtom;
      },
    set:
      (param) =>
      ({ set }, newValue) => {
        set(toggleAtomFamily(param), newValue);

        if (newValue) toggleState.add(param);
        else toggleState.delete(param);

        if (toggleState.size > 0) setPersistent(key, version, [...toggleState]);
        else clearPersistent(key);
      },
  });

  const toggleKeys = () => toggleState.keys();

  const useClearToggle = () => {
    return useRecoilCallback(
      ({ set }) =>
        () => {
          for (const key of toggleState.keys()) {
            set(toggleCollapsedSelectorFamily(key), false);
          }
        },
      []
    );
  };

  return [toggleCollapsedSelectorFamily, toggleKeys, useClearToggle];
};
