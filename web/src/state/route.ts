import { atom, atomFamily, selectorFamily, useRecoilCallback } from "recoil";
import { persistentStorageEffect } from ".";
import { clearPersistent, getPersistent, setPersistent } from "../utility";

async function loadDefaultRouteFiles() {
  const { routeFilesLookup } = await import("../../../common/data");

  const routeFiles = [
    routeFilesLookup["./routes/act-1.txt"],
    routeFilesLookup["./routes/act-2.txt"],
    routeFilesLookup["./routes/act-3.txt"],
    routeFilesLookup["./routes/act-4.txt"],
    routeFilesLookup["./routes/act-5.txt"],
    routeFilesLookup["./routes/act-6.txt"],
    routeFilesLookup["./routes/act-7.txt"],
    routeFilesLookup["./routes/act-8.txt"],
    routeFilesLookup["./routes/act-9.txt"],
    routeFilesLookup["./routes/act-10.txt"],
  ];

  return routeFiles;
}

export const routeFilesAtom = atom<string[]>({
  key: "routeFilesAtom",
  default: getPersistent("route-files") || loadDefaultRouteFiles(),
  effects: [persistentStorageEffect("route-files")],
});

const routeProgress = new Set<string>(
  getPersistent<string[]>("route-progress")
);

const routeProgressAtomFamily = atomFamily<boolean, string>({
  key: "routeProgressAtomFamily",
  default: (param) => routeProgress.has(param),
});

export const routeProgressSelectorFamily = selectorFamily<boolean, string>({
  key: "routeProgressSelectorFamily",
  get:
    (param) =>
    ({ get }) => {
      const routeProgressAtom = get(routeProgressAtomFamily(param));
      return routeProgressAtom;
    },
  set:
    (param) =>
    ({ set }, newValue) => {
      set(routeProgressAtomFamily(param), newValue);

      if (newValue) routeProgress.add(param);
      else routeProgress.delete(param);

      if (routeProgress.size > 0)
        setPersistent("route-progress", [...routeProgress]);
      else clearPersistent("route-progress");
    },
});

export const routeProgressKeys = () => routeProgress.keys();

export function useClearRouteProgress() {
  return useRecoilCallback(
    ({ set }) =>
      () => {
        for (const key of routeProgress.keys()) {
          set(routeProgressSelectorFamily(key), false);
        }
      },
    []
  );
}
