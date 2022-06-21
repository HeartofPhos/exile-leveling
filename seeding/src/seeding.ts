import { cargoQuery, getImageUrl } from "./wiki";
import { Area, Gem, Monster, Quest } from "../../common/types";

function ensureRecord<K extends keyof any, T>(
  record: Record<K, T>,
  key: K,
  defaultValue: T
) {
  let value = record[key];
  if (value === undefined) {
    value = defaultValue;
    record[key] = value;
  }

  return value;
}

export async function getGems() {
  const queryResult = await cargoQuery({
    tables: ["items", "skill_gems"],
    join_on: ["items._pageName = skill_gems._pageName"],
    fields: [
      "items._pageName = page",
      "items.inventory_icon = inventory_icon",
      "items.required_level = required_level",
      "skill_gems.primary_attribute = primary_attribute",
    ],
    where:
      '(items.tags HOLDS "gem") AND (NOT items._pageName LIKE "Template:%")',
    order_by: ["items._pageName"],
  });

  let cnt = 0;
  const result: Record<Gem["id"], Gem> = {};
  for (const item of queryResult) {
    const image_url = await getImageUrl(item.inventory_icon);
    console.log(`gem image: ${++cnt}/${queryResult.length}`);

    result[item.page] = {
      id: item.page,
      image_url: image_url,
      primary_attribute: item.primary_attribute,
      required_level: Number(item.required_level),
    };
  }

  return result;
}

export async function getQuests() {
  const questRewards = await getQuestRewards();
  const vendorRewards = await getVendorRewards();

  const result: Record<Quest["quest_id"], Quest> = {};
  for (const item of questRewards) {
    let quest = result[item.quest_id];
    if (!quest) {
      quest = {
        quest_id: item.quest_id,
        quest: item.quest,
        act: item.act,
        quest_rewards: [],
        vendor_rewards: [],
      };
      result[item.quest_id] = quest;
    }

    quest.quest_rewards.push({
      item_id: item.item_id,
      classes: item.classes?.split(",") || [],
    });
  }

  for (const item of vendorRewards) {
    let quest = result[item.quest_id];
    if (!quest) {
      quest = {
        quest_id: item.quest_id,
        quest: item.quest,
        act: item.act,
        quest_rewards: [],
        vendor_rewards: [],
      };
      result[item.quest_id] = quest;
    }

    quest.vendor_rewards.push({
      item_id: item.item_id,
      classes: item.classes?.split(",") || [],
      npc: item.npc,
    });
  }

  return result;
}

export async function getQuestRewards() {
  const queryResult = await cargoQuery({
    tables: ["quest_rewards"],
    fields: [
      "quest_id=quest_id",
      "quest",
      "_pageName=item_id",
      "act",
      "classes",
    ],
    order_by: ["act", "quest_id"],
  });

  return queryResult;
}

export async function getVendorRewards() {
  const queryResult = await cargoQuery({
    tables: ["vendor_rewards"],
    fields: [
      "quest_id=quest_id",
      "quest",
      "_pageName=item_id",
      "act",
      "classes",
      "npc",
    ],
    order_by: ["act", "quest_id"],
  });

  return queryResult;
}

export async function getAreas() {
  const result: Record<Area["id"], Area> = {};

  let done = new Set<string>();
  let todo = ["1_1_1"];

  let cnt = 0;
  while (todo.length > 0) {
    const areaQueryResult = await cargoQuery({
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

    for (const area of areaQueryResult) {
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
        const monsterQueryResult = await cargoQuery({
          tables: ["monsters"],
          fields: ["metadata_id=metadata_id", "name"],
          where: `metadata_id IN (${boss_monster_ids
            .map((x) => `"${x}"`)
            .join(",")})`,
        });

        bosses = monsterQueryResult.map((x) => ({
          metadata_id: x.metadata_id,
          name: x.name,
        }));
      } else {
        bosses = [];
      }

      result[area.id] = {
        id: area.id,
        name: area.name,
        act: area.act,
        has_waypoint: area.has_waypoint == "1",
        is_town_area: area.is_town_area == "1",
        connection_ids: connection_ids,
        bosses: bosses,
      };

      cnt++;
    }

    console.log(`Areas ${cnt}`);
  }

  return result;
}
