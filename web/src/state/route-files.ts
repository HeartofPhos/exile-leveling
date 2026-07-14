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
  (key) => key,
  (value) => value
);

async function loadDefaultRouteFiles() {
  const { getRouteFiles } = await import("common");

  const routeSources = await Promise.all([
    RouteSourceLookup["./routes/act-1.txt"],
    RouteSourceLookup["./routes/act-2.txt"],
    RouteSourceLookup["./routes/act-3.txt"],
    RouteSourceLookup["./routes/act-4.txt"],
    RouteSourceLookup["./routes/act-5.txt"],
    RouteSourceLookup["./routes/act-6.txt"],
    RouteSourceLookup["./routes/act-7.txt"],
    RouteSourceLookup["./routes/act-8.txt"],
    RouteSourceLookup["./routes/act-9.txt"],
    RouteSourceLookup["./routes/act-10.txt"],
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
