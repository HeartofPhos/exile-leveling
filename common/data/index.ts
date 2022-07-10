import { Quests, Areas, BossWaypoints, Gems, GemColours } from "../types";

import QUESTS_JSON from "./json/quests.json";
import AREAS_JSON from "./json/areas.json";
import BOSS_WAYPOINTS_JSON from "./json/boss-waypoints.json";
import GEMS_JSON from "./json/gems.json";
import GEM_COLOURS_JSON from "./json/gem-colours.json";

export const quests = QUESTS_JSON as Quests;
export const areas = AREAS_JSON as Areas;
export const bossWaypoints = BOSS_WAYPOINTS_JSON as BossWaypoints;
export const gems = GEMS_JSON as Gems;
export const gemColours = GEM_COLOURS_JSON as GemColours;

//@ts-expect-error
export const routeSources: Record<string, string> = import.meta.glob(
  "./routes/*.txt",
  { as: "raw" }
);
