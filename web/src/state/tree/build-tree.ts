import type { RouteData } from "common";
import { atomWithStorage } from "jotai/utils";
import { versionedStorage } from "..";

const BUILD_PASSIVE_TREES_VERSION = 0;
export const buildTreesSelector = atomWithStorage<RouteData.BuildTree[] | null>(
  "build-trees",
  null,
  versionedStorage(BUILD_PASSIVE_TREES_VERSION),
);
