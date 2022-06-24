export interface Gem {
  id: string;
  image_url: string;
  primary_attribute: string;
  required_level: number;
}

export interface QuestReward {
  classes?: string[];
}

export interface VendorReward {
  classes: string[];
  npc: string;
}

export interface Quest {
  id: string;
  name: string;
  act: string;
  quest_rewards: Record<string, QuestReward>;
  vendor_rewards: Record<string, VendorReward>;
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
