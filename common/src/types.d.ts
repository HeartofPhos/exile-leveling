export namespace GameData {
  export type Quests = Record<Quest["id"], Quest>;
  export type Areas = Record<Area["id"], Area>;
  export type KillWaypoints = Record<string, Area["id"][]>;
  export type Gems = Record<Gem["id"], Gem>;
  export type VariantGemLookup = Record<Gem["id"], Gem["id"]>;
  export type GemColours = Record<Gem["primary_attribute"], string>;
  export type Characters = Record<string, Character>;

  export interface Gem {
    id: string;
    name: string;
    primary_attribute: string;
    required_level: number;
    is_support: boolean;
  }

  export interface Character {
    start_gem_id: string;
    chest_gem_id: string;
  }

  export interface QuestReward {
    classes: string[];
  }

  export interface VendorReward {
    classes: string[];
    npc: string;
  }

  export interface RewardOffer {
    quest_npc: string;
    quest: Partial<Record<string, QuestReward>>;
    vendor: Partial<Record<string, VendorReward>>;
  }

  export interface Quest {
    id: string;
    name: string;
    act: string;
    reward_offers: Partial<Record<string, RewardOffer>>;
  }

  export interface Area {
    id: string;
    name: string;
    map_name: string | null;
    act: number;
    level: number;
    has_waypoint: boolean;
    is_town_area: boolean;
    parent_town_area_id: string | null;
    connection_ids: string[];
    crafting_recipes: string[];
  }
}

export namespace RouteData {
  export type Route = {
    sections: Section[];
    edges: GameData.Area["id"][];
  };

  export interface Section {
    name: string;
    steps: Step[];
  }

  export type Step = FragmentStep | GemStep;

  export interface FragmentStep {
    type: "fragment_step";
    parts: Fragments.AnyFragment[];
    subSteps: FragmentStep[];
    edgeIndex: number | null;
  }

  export interface GemStep {
    type: "gem_step";
    requiredGem: RequiredGem;
    rewardType: "quest" | "vendor";
    count: number;
  }

  export interface RouteFile {
    name: string;
    contents: string;
  }

  export interface BuildData {
    characterClass: string;
    bandit: "None" | "Oak" | "Kraityn" | "Alira";
    leagueStart: boolean;
    library: boolean;
  }

  export interface BuildTree {
    name: string;
    version: string;
    url: string;
  }

  export interface RequiredGem {
    id: GameData.Gem["id"];
    note: string;
    count: number;
  }

  export interface GemLinkGroup {
    title: string;
    primaryGems: GemLink[];
    secondaryGems: GemLink[];
  }

  export interface GemLink {
    id: GameData.Gem["id"];
    quests: { questId: GameData.Quest["id"]; rewardOfferId: string }[];
  }
}

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
    | DirectionFragment
    | CopyFragment;

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

  export interface CopyFragment {
    type: "copy";
    text: string;
    side: "head" | "tail";
  }
}
