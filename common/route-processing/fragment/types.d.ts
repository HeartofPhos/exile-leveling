import { GameData } from "../../types";

export namespace Fragments {
  export type AnyFragment =
    | string
    | KillFragment
    | ArenaFragment
    | AreaFragment
    | EnterFragment
    | LogoutFragment
    | WaypointFragment
    | WaypointUseFragment
    | WaypointGetFragment
    | PortalUseFragment
    | PortalSetFragment
    | QuestFragment
    | QuestTextFragment
    | GenericFragment
    | RewardQuestFragment
    | RewardVendorFragment
    | TrialFragment
    | AscendFragment
    | CraftingFragment
    | DirectionFragment;

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

  export interface WaypointUseFragment {
    type: "waypoint_use";
    dstAreaId: GameData.Area["id"];
    srcAreaId: GameData.Area["id"];
  }

  export interface WaypointGetFragment {
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
    rewardOffers: string[];
  }

  export interface QuestTextFragment {
    type: "quest_text";
    value: string;
  }

  export interface PortalUseFragment {
    type: "portal_use";
    dstAreaId: GameData.Area["id"];
  }

  export interface PortalSetFragment {
    type: "portal_set";
  }

  export interface CraftingFragment {
    type: "crafting";
    crafting_recipes: string[];
  }

  export interface DirectionFragment {
    type: "dir";
    dirIndex: number;
  }
}
