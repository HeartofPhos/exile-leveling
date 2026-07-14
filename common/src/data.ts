import type { GameData } from "./types.js";
import AREAS_JSON from "../data/json/areas.json" with { type: "json" };
import AWAKENED_GEM_LOOKUP_JSON from "../data/json/awakened-gem-lookup.json" with { type: "json" };
import CHARACTERS_JSON from "../data/json/characters.json" with { type: "json" };
import GEM_COLOURS_JSON from "../data/json/gem-colours.json" with { type: "json" };
import GEMS_JSON from "../data/json/gems.json" with { type: "json" };
import KILL_WAYPOINTS_JSON from "../data/json/kill-waypoints.json" with { type: "json" };
import QUESTS_JSON from "../data/json/quests.json" with { type: "json" };
import VAAL_GEM_LOOKUP_JSON from "../data/json/vaal-gem-lookup.json" with { type: "json" };

export namespace Data {
  export const Areas = AREAS_JSON as GameData.Areas;
  export const AwakenedGemLookup =
    AWAKENED_GEM_LOOKUP_JSON as GameData.VariantGemLookup;
  export const Characters = CHARACTERS_JSON as GameData.Characters;
  export const GemColours = GEM_COLOURS_JSON as GameData.GemColours;
  export const Gems = GEMS_JSON as GameData.Gems;
  export const KillWaypoints = KILL_WAYPOINTS_JSON as GameData.KillWaypoints;
  export const Quests = QUESTS_JSON as GameData.Quests;
  export const VaalGemLookup =
    VAAL_GEM_LOOKUP_JSON as GameData.VariantGemLookup;
}
