export interface Gem {
  id: string;
  image_url: string;
  primary_attribute: string;
}

export interface QuestReward {
  item_id: string;
  classes?: string[];
}

export interface VendorReward {
  item_id: string;
  classes?: string[];
  npc: string;
}

export interface Quest {
  quest_id: string;
  quest: string;
  act: string;
  quest_rewards: QuestReward[];
  vendor_rewards: VendorReward[];
}

export interface Area {
  id: string;
  name: string;
  act: string;
  has_waypoint: boolean;
  is_town_area: boolean;
  connection_ids: string[];
  bosses: Monster[];
}

export interface Monster {
  metadata_id: string;
  name: string;
}
