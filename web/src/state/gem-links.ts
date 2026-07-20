import { persistentAtom } from ".";
import type { RouteData } from "common";

const GEM_LINKS_VERSION = 0;

export const gemLinksSelector = persistentAtom<RouteData.GemLinkGroup[]>(
  "gem-links",
  [],
  GEM_LINKS_VERSION,
);
