import { GameData } from "../../../common/types";
import { Dat } from "../../data";
import { cargoQuery } from "../wiki";

const BREAKING_SOME_EGGS_REWARD_2 = [
  "Metadata/Items/Gems/SkillGemSteelskin",
  "Metadata/Items/Gems/SkillGemFrostblink",
  "Metadata/Items/Gems/SkillGemDash",
];

const VENDOR_REWARD_MAPPING: Partial<
  Record<string, (item_id: string) => string>
> = {
  //Hack for The Caged Brute
  ["a1q2"]: (item_id) => (item_id.includes("Support") ? "a1q2b" : "a1q2"),
  //Hack for Breaking Some Eggs
  ["a1q4"]: (item_id) =>
    BREAKING_SOME_EGGS_REWARD_2.every((x) => x !== item_id) ? "a1q4" : "a1q4b",
};

const SKIP_QUESTS = new Set([
  // Wiki is outdated, The Root of the Problem
  "a2q9",
]);

function processVendorReward(
  questId: string,
  quests: Record<string, GameData.Quest>,
  item_id: string,
  vendor_reward: GameData.VendorReward
) {
  if (SKIP_QUESTS.has(questId)) return;

  const quest = quests[questId];
  if (!quest) return;

  const mapRewardOfferId = VENDOR_REWARD_MAPPING[quest.id] || (() => quest.id);

  const reward_offer_id = mapRewardOfferId(item_id);
  const reward_offer = quest.reward_offers[reward_offer_id];
  if (!reward_offer) {
    console.log(`invalid reward_offer_id: ${reward_offer_id}`);
    return;
  }

  reward_offer.vendor[item_id] = vendor_reward;
}

// QuestVendorRewards.dat no longer exists, use wiki data
export async function getQuests() {
  const result: GameData.Quests = {};

  const rewardOfferNPCLookup: Partial<Record<string, string>> = {};
  for (const npcTalk of Dat.NPCTalk.data) {
    if (npcTalk.QuestRewardOffersKey !== null) {
      const quest_reward_offer =
        Dat.QuestRewardOffers.data[npcTalk.QuestRewardOffersKey];
      const npc = Dat.NPCs.data[npcTalk.NPCKey];
      rewardOfferNPCLookup[quest_reward_offer.Id] = npc.Name;
    }
  }

  for (let i = 0; i < Dat.Quest.data.length; i++) {
    const questRow = Dat.Quest.data[i];
    if (questRow.Type != 0 && questRow.Type != 1) continue;

    const quest: GameData.Quest = {
      id: questRow.Id,
      name: questRow.Name,
      act: questRow.Act.toString(),
      reward_offers: {},
    };

    result[quest.id] = quest;
  }

  for (const questReward of Dat.QuestRewards.data) {
    const questRewardOffer =
      Dat.QuestRewardOffers.data[questReward.RewardOffer];
    const baseItemType = Dat.BaseItemTypes.data[questReward.Reward];
    const quest = result[Dat.Quest.data[questRewardOffer.QuestKey].Id];
    if (!quest) continue;

    const npc = rewardOfferNPCLookup[questRewardOffer.Id];
    if (npc === undefined) continue;

    let reward_offer = quest.reward_offers[questRewardOffer.Id];
    if (reward_offer === undefined) {
      reward_offer = quest.reward_offers[questRewardOffer.Id] = {
        quest_npc: npc,
        quest: {},
        vendor: {},
      };
    }

    let quest_reward = reward_offer.quest[baseItemType.Id];
    if (quest_reward === undefined) {
      quest_reward = reward_offer.quest[baseItemType.Id] = {
        classes: [],
      };
    }

    quest_reward.classes.push(
      ...questReward.Characters.map((x: any) => Dat.Characters.data[x].Name)
    );
  }

  const vendorRewards = await getVendorRewards();
  for (const item of vendorRewards) {
    processVendorReward(item.quest_id, result, item.item_id, {
      classes: item.classes?.split(",") || [],
      npc: item.npc,
    });
  }
  return result;
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
