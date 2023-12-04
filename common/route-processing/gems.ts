import { Data } from "../data";
import { GameData } from "../types";
import { Fragments } from "./fragment/types";
import { RouteData } from "./types";

export function buildGemSteps(
  questFragment: Fragments.QuestFragment,
  buildData: RouteData.BuildData,
  requiredGems: RouteData.RequiredGem[],
  questGems: Set<number>,
  vendorGems: Set<number>
) {
  const quest = Data.Quests[questFragment.questId];
  const gemSteps: RouteData.GemStep[] = [];

  // find all quest gems
  for (const rewardOfferId of questFragment.rewardOffers) {
    const reward_offer = quest.reward_offers[rewardOfferId];
    if (!reward_offer) continue;

    const questReward = findQuestGem(
      buildData,
      requiredGems,
      questGems,
      reward_offer.quest
    );
    if (questReward !== null)
      gemSteps.push({
        type: "gem_step",
        requiredGem: requiredGems[questReward],
        rewardType: "quest",
        count: 1,
      });
  }

  // find all vendor gems
  for (const rewardOfferId of questFragment.rewardOffers) {
    const reward_offer = quest.reward_offers[rewardOfferId];
    if (!reward_offer) continue;

    const vendorRewards = findVendorGems(
      buildData,
      requiredGems,
      questGems,
      vendorGems,
      reward_offer.vendor
    );
    for (const vendorReward of vendorRewards) {
      let requiredGem = requiredGems[vendorReward];
      gemSteps.push({
        type: "gem_step",
        requiredGem: requiredGem,
        rewardType: "vendor",
        count: requiredGem.count - (questGems.has(vendorReward) ? 1 : 0),
      });
    }
  }

  return gemSteps;
}

export function findCharacterGems(
  buildData: RouteData.BuildData,
  requiredGems: RouteData.RequiredGem[],
  questGems: Set<number>
) {
  const character = Data.Characters[buildData.characterClass];
  for (let i = 0; i < requiredGems.length; i++) {
    const requiredGem = requiredGems[i];
    if (questGems.has(i)) continue;

    if (character.start_gem_id === requiredGem.id) {
      questGems.add(i);
    }

    if (character.chest_gem_id === requiredGem.id) {
      questGems.add(i);
    }
  }
}

function findQuestGem(
  buildData: RouteData.BuildData,
  requiredGems: RouteData.RequiredGem[],
  questGems: Set<number>,
  quest_rewards: GameData.RewardOffer["quest"]
): number | null {
  for (let i = 0; i < requiredGems.length; i++) {
    const requiredGem = requiredGems[i];
    if (questGems.has(i)) continue;

    const reward = quest_rewards[requiredGem.id];
    if (!reward) continue;

    const validClass =
      reward.classes.length == 0 ||
      reward.classes.some((x) => x == buildData.characterClass);

    if (validClass) {
      questGems.add(i);
      return i;
    }
  }

  return null;
}

function findVendorGems(
  buildData: RouteData.BuildData,
  requiredGems: RouteData.RequiredGem[],
  questGems: Set<number>,
  vendorGems: Set<number>,
  vendor_rewards: GameData.RewardOffer["vendor"]
): number[] {
  const result: number[] = [];
  for (let i = 0; i < requiredGems.length; i++) {
    const requiredGem = requiredGems[i];
    if ((requiredGem.count === 1 && questGems.has(i)) || vendorGems.has(i))
      continue;

    const reward = vendor_rewards[requiredGem.id];
    if (!reward) continue;

    const validClass =
      reward.classes.length === 0 ||
      reward.classes.some((x) => x == buildData.characterClass);

    if (validClass) {
      vendorGems.add(i);
      result.push(i);
    }
  }

  return result;
}
