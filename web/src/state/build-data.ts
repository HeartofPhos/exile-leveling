import { persistentAtom } from ".";
import type { RouteData } from "common";

const BUILD_DATA_VERSION = 3;

export const buildDataSelector = persistentAtom<RouteData.BuildData>(
  "build-data",
  {
    characterClass: "None",
    bandit: "Alira",
    leagueStart: true,
    library: true,
  },
  BUILD_DATA_VERSION,
);
