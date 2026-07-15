import { versionedStorage } from ".";
import type { RouteData } from "common";
import { atomWithStorage } from "jotai/utils";

const BUILD_DATA_VERSION = 3;

export const buildDataSelector = atomWithStorage<RouteData.BuildData>(
  "build-data",
  {
    characterClass: "None",
    bandit: "Alira",
    leagueStart: true,
    library: true,
  },
  versionedStorage(BUILD_DATA_VERSION),
);
