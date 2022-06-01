export interface Gem {
  id: string;
  image_url: string;
  primary_attribute: string;
}

export interface Reward {
  item_id: string;
  classes?: string[];
}

export interface QuestRewards {
  quest_id: string;
  quest: string;
  act: string;
  rewards: Reward[];
}

export interface VendorRewards {
  quest_id: string;
  quest: string;
  act: string;
  rewards: Reward[];
  npc: string;
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
