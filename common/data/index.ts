import { globImportLazy } from "../../web/src/utility";
import { GameData } from "../types";
import AREAS_JSON from "./json/areas.json";
import AWAKENED_GEM_LOOKUP_JSON from "./json/awakened-gem-lookup.json";
import CHARACTERS_JSON from "./json/characters.json";
import GEM_COLOURS_JSON from "./json/gem-colours.json";
import GEMS_JSON from "./json/gems.json";
import KILL_WAYPOINTS_JSON from "./json/kill-waypoints.json";
import QUESTS_JSON from "./json/quests.json";
import VAAL_GEM_LOOKUP_JSON from "./json/vaal-gem-lookup.json";

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

  export const RouteSourceLookup = globImportLazy<string>(
    import.meta.glob("./routes/*.txt", { query: "?raw", import: "default" }),
    (key) => key,
    (value) => value
  );
}
