export namespace GameData {
  export type Quests = Record<Quest["id"], Quest>;
  export type Areas = Record<Area["id"], Area>;
  export type KillWaypoints = Record<string, Area["id"][]>;
  export type Gems = Record<Gem["id"], Gem>;
  export type VariantGemLookup = Record<Gem["id"], Gem["id"]>;
  export type GemColours = Record<Gem["primary_attribute"], string>;

  export interface Gem {
    id: string;
    name: string;
    primary_attribute: string;
    required_level: number;
    cost: string;
  }

  export interface QuestReward {
    classes: string[];
  }

  export interface VendorReward {
    classes: string[];
    npc: string;
  }

  export interface RewardOffer {
    quest: Partial<Record<string, QuestReward>>;
    vendor: Partial<Record<string, VendorReward>>;
  }

  export interface Quest {
    id: string;
    name: string;
    act: string;
    reward_offers: RewardOffer[];
  }

  export interface Area {
    id: string;
    name: string;
    map_name: string | null;
    act: number;
    has_waypoint: boolean;
    is_town_area: boolean;
    parent_town_area_id: string | null;
    connection_ids: string[];
    crafting_recipes: string[];
  }
}
