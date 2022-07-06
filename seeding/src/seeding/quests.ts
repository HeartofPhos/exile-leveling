import { Quest } from "../../../common/types";
import { cargoQuery } from "../wiki";
import fetch from "cross-fetch";

const BREAKING_SOME_EGGS_REWARD_2 = [
  "Metadata/Items/Gems/SkillGemSteelskin",
  "Metadata/Items/Gems/SkillGemFrostblink",
  "Metadata/Items/Gems/SkillGemDash",
];

function postProcessQuest(quest: Quest) {
  switch (quest.id) {
    //Hack for The Caged Brute
    case "a1q2":
      {
        const updatedRewards: Quest["quest_rewards"] = [{}, {}];
        for (const key in quest.quest_rewards[0]) {
          if (key.includes("Support")) {
            updatedRewards[0][key] = quest.quest_rewards[0][key];
          } else {
            updatedRewards[1][key] = quest.quest_rewards[0][key];
          }
        }

        quest.quest_rewards = updatedRewards;
      }
      break;
    //Hack for Breaking Some Eggs
    case "a1q4":
      {
        const updatedRewards: Quest["quest_rewards"] = [{}, {}];
        for (const key in quest.quest_rewards[0]) {
          if (BREAKING_SOME_EGGS_REWARD_2.some((x) => x == key)) {
            updatedRewards[1][key] = quest.quest_rewards[0][key];
          } else {
            updatedRewards[0][key] = quest.quest_rewards[0][key];
          }
        }

        quest.quest_rewards = updatedRewards;
      }
      break;
  }
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
    if (type != 0 && type != 1) continue;

    const quest: Quest = {
      id: row[idIndex],
      name: row[nameIndex],
      act: row[actIndex].toString(),
      quest_rewards: [{}],
      vendor_rewards: {},
    };

    result[quest.id] = quest;
  }

  const questRewards = await getQuestRewards();
  for (const item of questRewards) {
    const quest = result[item.quest_id];
    if (!quest) continue;
    quest.quest_rewards[0][item.item_id] = {
      classes: item.classes?.split(",") || [],
    };
  }

  const vendorRewards = await getVendorRewards();
  for (const item of vendorRewards) {
    const quest = result[item.quest_id];
    if (!quest) continue;
    quest.vendor_rewards[item.item_id] = {
      classes: item.classes?.split(",") || [],
      npc: item.npc,
    };
  }

  for (const key in result) {
    const quest = result[key];
    postProcessQuest(quest);
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
      '(quest_rewards.act IS NOT NULL) AND (NOT items._pageName LIKE "Template:%") AND (items.metadata_id IS NOT NULL)',
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
      '(vendor_rewards.act IS NOT NULL) AND (NOT items._pageName LIKE "Template:%") AND (items.metadata_id IS NOT NULL)',
    order_by: [
      "vendor_rewards.act",
      "vendor_rewards.quest_id",
      "vendor_rewards._pageName",
    ],
  });

  return queryResult;
}
