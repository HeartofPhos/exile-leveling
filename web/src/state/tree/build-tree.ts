import type { RouteData } from "common";
import { persistentAtom } from "..";

const BUILD_PASSIVE_TREES_VERSION = 0;
export const buildTreesSelector = persistentAtom<RouteData.BuildTree[] | null>(
  "build-trees",
  null,
  BUILD_PASSIVE_TREES_VERSION,
);
