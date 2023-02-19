import { GameData } from "../../../common/types";
import { cargoQuery } from "../wiki";
import { QuestDat } from "../../data";

const BREAKING_SOME_EGGS_REWARD_2 = [
  "Metadata/Items/Gems/SkillGemSteelskin",
  "Metadata/Items/Gems/SkillGemFrostblink",
  "Metadata/Items/Gems/SkillGemDash",
];

function processRewards(quest: GameData.Quest, test: (key: string) => boolean) {
  const reward_offers: GameData.Quest["reward_offers"] = [
    { quest: {}, vendor: {} },
    { quest: {}, vendor: {} },
  ];

  for (const key in quest.reward_offers[0].quest) {
    if (test(key)) {
      reward_offers[0].quest[key] = quest.reward_offers[0].quest[key];
    } else {
      reward_offers[1].quest[key] = quest.reward_offers[0].quest[key];
    }
  }

  for (const key in quest.reward_offers[0].vendor) {
    if (test(key)) {
      reward_offers[0].vendor[key] = quest.reward_offers[0].vendor[key];
    } else {
      reward_offers[1].vendor[key] = quest.reward_offers[0].vendor[key];
    }
  }

  quest.reward_offers = reward_offers;
}

function postProcessQuest(quest: GameData.Quest) {
  switch (quest.id) {
    //Hack for The Caged Brute
    case "a1q2":
      processRewards(quest, (key) => key.includes("Support"));
      break;
    //Hack for Breaking Some Eggs
    case "a1q4":
      processRewards(quest, (key) =>
        BREAKING_SOME_EGGS_REWARD_2.every((x) => x != key)
      );
      break;
  }
}

// QuestVendorRewards.dat no longer exists, use wiki data
// Impractical to handle QuestRewards & VendorRewards from different sources
export async function getQuests() {
  const result: GameData.Quests = {};

  for (const row of QuestDat.data) {
    if (row.Type != 0 && row.Type != 1) continue;

    const quest: GameData.Quest = {
      id: row.Id,
      name: row.Name,
      act: row.Act.toString(),
      reward_offers: [{ quest: {}, vendor: {} }],
    };

    result[quest.id] = quest;
  }

  const questRewards = await getQuestRewards();
  for (const item of questRewards) {
    const quest = result[item.quest_id];
    if (!quest) continue;
    quest.reward_offers[0].quest[item.item_id] = {
      classes: item.classes?.split(",") || [],
    };
  }

  const vendorRewards = await getVendorRewards();
  for (const item of vendorRewards) {
    const quest = result[item.quest_id];
    if (!quest) continue;
    quest.reward_offers[0].vendor[item.item_id] = {
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
