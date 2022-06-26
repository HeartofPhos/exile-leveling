import { cargoQuery } from "./wiki";
import { Area, Gem, Monster, Quest } from "../../common/types";
import fetch from "cross-fetch";

function getGemCost(required_level: number) {
  if (required_level < 8) return "CurrencyIdentification";
  if (required_level < 16) return "CurrencyUpgradeToMagic";
  if (required_level < 28) return "CurrencyRerollMagic";
  if (required_level < 38) return "CurrencyUpgradeRandomly";
  return "CurrencyUpgradeToRare";
}

export async function getGems() {
  const queryResult = await cargoQuery({
    tables: ["items", "skill_gems"],
    join_on: ["items._pageName = skill_gems._pageName"],
    fields: [
      "items._pageName = page",
      "items.metadata_id = metadata_id",
      "items.inventory_icon = inventory_icon",
      "items.required_level = required_level",
      "skill_gems.primary_attribute = primary_attribute",
    ],
    where:
      '(items.tags HOLDS "gem") AND (NOT items._pageName LIKE "Template:%") AND (items.metadata_id IS NOT NULL)',
    order_by: ["items._pageName"],
  });

  const result: Record<Gem["id"], Gem> = {};
  for (const item of queryResult) {
    const required_level = Number(item.required_level);

    result[item.metadata_id] = {
      id: item.metadata_id,
      name: item.page,
      primary_attribute: item.primary_attribute,
      required_level: required_level,
      cost: getGemCost(required_level),
    };
  }

  return result;
}

export async function getQuests(poeDatVersion: string) {
  const questDat = await fetch(
    `https://poedat.erosson.org/pypoe/v1/tree/${poeDatVersion}/default/Quest.dat.min.json`
  ).then((x) => x.json());

  const result: Record<Quest["id"], Quest> = {};

  const idIndex = questDat.header.find((x: any) => x.name == "Id").rowid;
  const actIndex = questDat.header.find((x: any) => x.name == "Act").rowid;
  const nameIndex = questDat.header.find((x: any) => x.name == "Name").rowid;
  const typeIndex = questDat.header.find((x: any) => x.name == "Type").rowid;
  for (const row of questDat.data) {
    const type = row[typeIndex];
    if (type == 0 || type == 1) {
      const quest: Quest = {
        id: row[idIndex],
        name: row[nameIndex],
        act: row[actIndex].toString(),
        quest_rewards: {},
        vendor_rewards: {},
      };

      result[quest.id] = quest;
    }
  }

  const questRewards = await getQuestRewards();
  const vendorRewards = await getVendorRewards();

  for (const item of questRewards) {
    let quest = result[item.quest_id];
    quest.quest_rewards[item.item_id] = {
      classes: item.classes?.split(",") || [],
    };
  }

  for (const item of vendorRewards) {
    let quest = result[item.quest_id];
    quest.vendor_rewards[item.item_id] = {
      classes: item.classes?.split(",") || [],
      npc: item.npc,
    };
  }

  return result;
}

export async function getQuestRewards() {
  const queryResult = await cargoQuery({
    tables: ["quest_rewards", "items"],
    join_on: ["items._pageName = quest_rewards._pageName"],
    fields: [
      "quest_rewards.quest_id=quest_id",
      "quest_rewards.quest",
      "items.metadata_id=item_id",
      "quest_rewards.act",
      "quest_rewards.classes",
    ],
    where:
      '(quest_rewards.act IS NOT NULL) AND (items.tags HOLDS "gem") AND (NOT items._pageName LIKE "Template:%") AND (items.metadata_id IS NOT NULL)',
    order_by: [
      "quest_rewards.act",
      "quest_rewards.quest_id",
      "quest_rewards._pageName",
    ],
  });

  return queryResult;
}

export async function getVendorRewards() {
  const queryResult = await cargoQuery({
    tables: ["vendor_rewards", "items"],
    join_on: ["items._pageName = vendor_rewards._pageName"],
    fields: [
      "vendor_rewards.quest_id=quest_id",
      "vendor_rewards.quest",
      "items.metadata_id=item_id",
      "vendor_rewards.act",
      "vendor_rewards.classes",
      "vendor_rewards.npc",
    ],
    where:
      '(vendor_rewards.act IS NOT NULL) AND (items.tags HOLDS "gem") AND (NOT items._pageName LIKE "Template:%") AND (items.metadata_id IS NOT NULL)',
    order_by: [
      "vendor_rewards.act",
      "vendor_rewards.quest_id",
      "vendor_rewards._pageName",
    ],
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
