import {
  atom,
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilCallback,
} from "recoil";
import { persistentStorageEffect } from ".";
import { RouteFile } from "../../../common/route-processing";
import { clearPersistent, getPersistent, setPersistent } from "../utility";

async function loadDefaultRouteFiles() {
  const { routeSourceLookup } = await import("../../../common/data");
  const { getRouteFiles } = await import("../../../common/route-processing");

  const routeSources = [
    routeSourceLookup["./routes/act-1.txt"],
    routeSourceLookup["./routes/act-2.txt"],
    routeSourceLookup["./routes/act-3.txt"],
    routeSourceLookup["./routes/act-4.txt"],
    routeSourceLookup["./routes/act-5.txt"],
    routeSourceLookup["./routes/act-6.txt"],
    routeSourceLookup["./routes/act-7.txt"],
    routeSourceLookup["./routes/act-8.txt"],
    routeSourceLookup["./routes/act-9.txt"],
    routeSourceLookup["./routes/act-10.txt"],
  ];

  return getRouteFiles(routeSources);
}

const routeFilesAtom = atom<RouteFile[] | null>({
  key: "routeFilesAtom",
  default: getPersistent("route-files"),
  effects: [persistentStorageEffect("route-files")],
});

export const routeFilesSelector = selector<RouteFile[]>({
  key: "routeFilesSelector",
  get: ({ get }) => {
    return get(routeFilesAtom) || loadDefaultRouteFiles();
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) set(routeFilesAtom, null);
    else set(routeFilesAtom, newValue);
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
