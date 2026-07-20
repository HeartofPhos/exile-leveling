import { RESET } from "jotai/utils";
import { persistentAtom } from ".";
import { globImportLazy } from "../utility";
import { type RouteData } from "common";
import { atom } from "jotai";

const ROUTE_PROGRESS_VERSION = 1;

export const RouteSourceLookup = globImportLazy<string>(
  import.meta.glob("/../common/data/routes/*.txt", {
    query: "?raw",
    import: "default",
  }),
  (key) => /.*\/(.*?).txt$/.exec(key)![1],
  (value) => value,
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

const routeFilesAtom = persistentAtom<RouteData.RouteFile[] | null>(
  "route-files",
  null,
  ROUTE_PROGRESS_VERSION,
);

export const routeFilesSelector = atom(
  async (get) => {
    const data = get(routeFilesAtom);

    if (data === null) {
      return await loadDefaultRouteFiles();
    }

    return data;
  },
  (_get, set, value: RouteData.RouteFile[] | typeof RESET) => {
    set(routeFilesAtom, value);
  },
);
