import { persistentStorageEffect } from ".";
import { NO_MIGRATORS, getPersistent, globImportLazy } from "../utility";
import { type RouteData } from "common";
import { DefaultValue, atom, selector } from "recoil";

const ROUTE_PROGRESS_VERSION = 1;

export const RouteSourceLookup = globImportLazy<string>(
  import.meta.glob("/../common/data/routes/*.txt", {
    query: "?raw",
    import: "default",
  }),
  (key) => /.*\/(.*?).txt$/.exec(key)![1],
  (value) => value
);

async function loadDefaultRouteFiles() {
  const { getRouteFiles } = await import("common");

  const routeSources = await Promise.all([
    RouteSourceLookup["act-1"],
    RouteSourceLookup["act-2"],
    RouteSourceLookup["act-3"],
    RouteSourceLookup["act-4"],
    RouteSourceLookup["act-5"],
    RouteSourceLookup["act-6"],
    RouteSourceLookup["act-7"],
    RouteSourceLookup["act-8"],
    RouteSourceLookup["act-9"],
    RouteSourceLookup["act-10"],
  ]);

  return getRouteFiles(routeSources);
}

const routeFilesAtom = atom<RouteData.RouteFile[] | null>({
  key: "routeFilesAtom",
  default: getPersistent("route-files", ROUTE_PROGRESS_VERSION, NO_MIGRATORS),
  effects: [persistentStorageEffect("route-files", ROUTE_PROGRESS_VERSION)],
});

export const routeFilesSelector = selector<RouteData.RouteFile[]>({
  key: "routeFilesSelector",
  get: ({ get }) => {
    return get(routeFilesAtom) || loadDefaultRouteFiles();
  },
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) set(routeFilesAtom, null);
    else set(routeFilesAtom, newValue);
  },
});
