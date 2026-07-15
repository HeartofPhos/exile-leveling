import { atomWithStorage } from "jotai/utils";
import { versionedStorage } from ".";
import type { RouteData } from "common";

const GEM_LINKS_VERSION = 0;

export const gemLinksSelector = atomWithStorage<RouteData.GemLinkGroup[]>(
  "gem-links",
  [],
  versionedStorage(GEM_LINKS_VERSION),
);
