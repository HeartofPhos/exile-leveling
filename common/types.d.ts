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
