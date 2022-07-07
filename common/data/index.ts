import { Quests, Areas, BossWaypoints, Gems, GemColours } from "../types";

import questsJson from "./quests.json";
import areasJson from "./areas.json";
import bossWaypointsJson from "./boss-waypoints.json";
import gemsJson from "./gems.json";
import gemColoursJson from "./gem-colours.json";

export const quests = questsJson as Quests;
export const areas = areasJson as Areas;
export const bossWaypoints = bossWaypointsJson as BossWaypoints;
export const gems = gemsJson as Gems;
export const gemColours = gemColoursJson as GemColours;

//@ts-expect-error
export const routeFiles: Record<string, string> = import.meta.glob(
  "./routes/*.txt",
  { as: "raw" }
);
