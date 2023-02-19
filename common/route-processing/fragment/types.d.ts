import { GameData } from "../../types";

export type Fragment =
  | KillFragment
  | ArenaFragment
  | AreaFragment
  | EnterFragment
  | LogoutFragment
  | WaypointFragment
  | UseWaypointFragment
  | GetWaypointFragment
  | PortalFragment
  | QuestFragment
  | QuestTextFragment
  | GenericFragment
  | RewardQuestFragment
  | RewardVendorFragment
  | TrialFragment
  | AscendFragment
  | DirectionFragment
  | CraftingFragment;

export interface KillFragment {
  type: "kill";
  value: string;
}

export interface ArenaFragment {
  type: "arena";
  value: string;
}

export interface AreaFragment {
  type: "area";
  areaId: GameData.Area["id"];
}

export interface LogoutFragment {
  type: "logout";
  areaId: GameData.Area["id"];
}

export interface EnterFragment {
  type: "enter";
  areaId: GameData.Area["id"];
}

export interface WaypointFragment {
  type: "waypoint";
}

export interface UseWaypointFragment {
  type: "waypoint_use";
  dstAreaId: GameData.Area["id"];
  srcAreaId: GameData.Area["id"];
}

export interface GetWaypointFragment {
  type: "waypoint_get";
}

export interface GenericFragment {
  type: "generic";
  value: string;
}

export interface RewardQuestFragment {
  type: "reward_quest";
  item: string;
}

export interface RewardVendorFragment {
  type: "reward_vendor";
  item: string;
  cost?: string;
}

export interface TrialFragment {
  type: "trial";
}

export interface AscendFragment {
  type: "ascend";
  version: "normal" | "cruel" | "merciless" | "eternal";
}

export interface QuestFragment {
  type: "quest";
  questId: GameData.Quest["id"];
  rewardOffers: number[];
}

export interface QuestTextFragment {
  type: "quest_text";
  value: string;
}

export interface PortalFragment {
  type: "portal";
  dstAreaId?: GameData.Area["id"];
}

export interface CraftingFragment {
  type: "crafting";
  crafting_recipes: string[];
}

export interface DirectionFragment {
  type: "dir";
  dirIndex: number;
}
