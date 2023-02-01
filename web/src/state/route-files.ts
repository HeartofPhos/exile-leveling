import { atom, selector, DefaultValue } from "recoil";
import { getPersistent } from "../utility";
import { RouteFile } from "../../../common/route-processing";
import { persistentStorageEffect } from ".";

const ROUTE_PROGRESS_VERSION = 1;

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
  default: getPersistent("route-files", ROUTE_PROGRESS_VERSION),
  effects: [persistentStorageEffect("route-files", ROUTE_PROGRESS_VERSION)],
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
