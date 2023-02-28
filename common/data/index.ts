import { GameData } from "../types";
import AREAS_JSON from "./json/areas.json";
import AWAKENED_GEM_LOOKUP_JSON from "./json/awakened-gem-lookup.json";
import GEM_COLOURS_JSON from "./json/gem-colours.json";
import GEMS_JSON from "./json/gems.json";
import KILL_WAYPOINTS_JSON from "./json/kill-waypoints.json";
import QUESTS_JSON from "./json/quests.json";
import VAAL_GEM_LOOKUP_JSON from "./json/vaal-gem-lookup.json";

export const areas = AREAS_JSON as GameData.Areas;
export const awakenedGemLookup =
  AWAKENED_GEM_LOOKUP_JSON as GameData.VariantGemLookup;
export const gemColours = GEM_COLOURS_JSON as GameData.GemColours;
export const gems = GEMS_JSON as GameData.Gems;
export const killWaypoints = KILL_WAYPOINTS_JSON as GameData.KillWaypoints;
export const quests = QUESTS_JSON as GameData.Quests;
export const vaalGemLookup = VAAL_GEM_LOOKUP_JSON as GameData.VariantGemLookup;

//@ts-expect-error
export const routeSourceLookup: Record<string, string> = import.meta.glob(
  "./routes/*.txt",
  { as: "raw" }
);
