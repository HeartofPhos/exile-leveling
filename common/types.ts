export type Quests = Record<Quest["id"], Quest>;
export type Areas = Record<Area["id"], Area>;
export type BossWaypoints = Record<string, Area["id"][]>;
export type Gems = Record<Gem["id"], Gem>;
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

export interface Quest {
  id: string;
  name: string;
  act: string;
  quest_rewards: Partial<Record<string, QuestReward>>[];
  vendor_rewards: Partial<Record<string, VendorReward>>[];
}

export interface Area {
  id: string;
  name: string;
  act: number;
  has_waypoint: boolean;
  is_town_area: boolean;
  connection_ids: string[];
}
