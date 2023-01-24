import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilCallback,
} from "recoil";
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

  return routeFiles.join("\n");
}

const routeFileAtom = atom<string | null>({
  key: "routeFileAtom",
  default: getPersistent("route-files"),
  effects: [persistentStorageEffect("route-files")],
});

export const routeFileSelector = selector<string>({
  key: "routeFileSelector",
  get: ({ get }) => {
    return get(routeFileAtom) || loadDefaultRouteFiles();
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) set(routeFileAtom, null);
    else set(routeFileAtom, newValue);
  },
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
