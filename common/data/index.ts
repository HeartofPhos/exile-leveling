import { Quests, Areas, KillWaypoints, Gems, GemColours } from "../types";

import QUESTS_JSON from "./json/quests.json";
import AREAS_JSON from "./json/areas.json";
import KILL_WAYPOINTS_JSON from "./json/kill-waypoints.json";
import GEMS_JSON from "./json/gems.json";
import GEM_COLOURS_JSON from "./json/gem-colours.json";

export const quests = QUESTS_JSON as Quests;
export const areas = AREAS_JSON as Areas;
export const killWaypoints = KILL_WAYPOINTS_JSON as KillWaypoints;
export const gems = GEMS_JSON as Gems;
export const gemColours = GEM_COLOURS_JSON as GemColours;

//@ts-expect-error
export const routeFiles: Record<string, string> = import.meta.glob(
  "./routes/*.txt",
  { as: "raw" }
);
