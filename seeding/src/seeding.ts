import { cargoQuery, getImageUrl } from "./wiki";

interface Gem {
  page: string;
  inventory_icon: string;
  image_url: string;
}

export async function getGems(): Promise<Gem[]> {
  const result = await cargoQuery({
    tables: ["items", "skill_gems"],
    join_on: ["items._pageName = skill_gems._pageName"],
    fields: [
      "items._pageName = page",
      "items.inventory_icon = inventory_icon",
      "skill_gems.primary_attribute = primary_attribute",
    ],
    where:
      '(items.tags HOLDS "gem") AND (NOT items._pageName LIKE "Template:%")',
  });

  let cnt = 0;
  for (const item of result) {
    item.inventory_icon = await getImageUrl(item.inventory_icon);
    console.log(`gem image: ${++cnt}/${result.length}`);
  }

  return result;
}

interface QuestReward {
  page: string;
  act: string;
  classes: string;
  quest: string;
  quest_id: string;
}

export async function getQuestRewards(): Promise<QuestReward[]> {
  const result = await cargoQuery({
    tables: ["quest_rewards"],
    fields: ["_pageName=page", "act", "classes", "quest", "quest_id=quest_id"],
  });

  return result;
}

interface VendorReward {
  page: string;
  act: string;
  classes: string;
  npc: string;
  quest: string;
  quest_id: string;
}

export async function getVendorRewards(): Promise<VendorReward[]> {
  const result = await cargoQuery({
    tables: ["vendor_rewards"],
    fields: [
      "_pageName=page",
      "act",
      "classes",
      "npc",
      "quest",
      "quest_id=quest_id",
    ],
  });

  return result;
}

interface Area {
  id: string;
  name: string;
  act: string;
  has_waypoint: boolean;
  is_town_area: boolean;
  connection_ids: string[];
  bosses: Monster[];
}

interface Monster {
  metadata_id: string;
  name: string;
}

export async function getAreas(): Promise<Area[]> {
  let result: Area[] = [];

  let done = new Set<string>();
  let todo = ["1_1_1"];

  while (todo.length > 0) {
    const areas = await cargoQuery({
      tables: ["areas"],
      fields: [
        "id",
        "name",
        "act",
        "has_waypoint=has_waypoint",
        "is_town_area=is_town_area",
        "connection_ids=connection_ids",
        "boss_monster_ids=boss_monster_ids",
      ],
      where: `id IN (${todo.map((x) => `"${x}"`).join(",")})`,
    });

    for (const id of todo) {
      done.add(id);
    }
    todo.length = 0;

    for (const area of areas) {
      let connection_ids: string[];
      if (area.connection_ids) {
        connection_ids = area.connection_ids.split(",");
        for (const connection_id of connection_ids) {
          if (!done.has(connection_id)) {
            todo.push(connection_id);
          }
        }
      } else {
        connection_ids = [];
      }

      let bosses: Monster[];
      if (area.boss_monster_ids) {
        const boss_monster_ids: string[] = area.boss_monster_ids.split(",");
        const monsters = await cargoQuery({
          tables: ["monsters"],
          fields: ["metadata_id=metadata_id", "name"],
          where: `metadata_id IN (${boss_monster_ids
            .map((x) => `"${x}"`)
            .join(",")})`,
        });

        bosses = monsters.map((x) => ({
          metadata_id: x.metadata_id,
          name: x.name,
        }));
      } else {
        bosses = [];
      }

      result.push({
        id: area.id,
        name: area.name,
        act: area.act,
        has_waypoint: area.has_waypoint,
        is_town_area: area.is_town_area,
        connection_ids: connection_ids,
        bosses: bosses,
      });
    }

    console.log(`Areas ${result.length}`);
  }

  return result;
}
