import { persistentStorageEffect } from ".";
import { RouteData } from "../../../common/route-processing/types";
import { getPersistent } from "../utility";
import { DefaultValue, atom, selector } from "recoil";

const ROUTE_PROGRESS_VERSION = 1;

async function loadDefaultRouteFiles() {
  const [{ Data }, { getRouteFiles }] = await Promise.all([
    import("../../../common/data"),
    import("../../../common/route-processing"),
  ]);

  const routeSources = await Promise.all([
    Data.RouteSourceLookup["./routes/act-1.txt"],
    Data.RouteSourceLookup["./routes/act-2.txt"],
    Data.RouteSourceLookup["./routes/act-3.txt"],
    Data.RouteSourceLookup["./routes/act-4.txt"],
    Data.RouteSourceLookup["./routes/act-5.txt"],
    Data.RouteSourceLookup["./routes/act-6.txt"],
    Data.RouteSourceLookup["./routes/act-7.txt"],
    Data.RouteSourceLookup["./routes/act-8.txt"],
    Data.RouteSourceLookup["./routes/act-9.txt"],
    Data.RouteSourceLookup["./routes/act-10.txt"],
  ]);

  return getRouteFiles(routeSources);
}

const routeFilesAtom = atom<RouteData.RouteFile[] | null>({
  key: "routeFilesAtom",
  default: getPersistent("route-files", ROUTE_PROGRESS_VERSION, {}),
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
