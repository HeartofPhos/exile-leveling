import { quests } from "../data";
import { GameData } from "../types";
import { Fragments } from "./fragment/types";
import { RouteData } from "./types";

export function buildGemSteps(
  questFragment: Fragments.QuestFragment,
  buildData: RouteData.BuildData,
  requiredGems: RouteData.RequiredGem[],
  routeGems: Set<number>
) {
  const quest = quests[questFragment.questId];

  const gemSteps: RouteData.GemStep[] = [];
  for (const rewardOfferId of questFragment.rewardOffers) {
    const reward_offer = quest.reward_offers[rewardOfferId];
    if (!reward_offer) continue;

    const questReward = findQuestGem(
      buildData,
      requiredGems,
      routeGems,
      reward_offer.quest
    );
    if (questReward !== null)
      gemSteps.push({
        type: "gem_step",
        requiredGem: requiredGems[questReward],
        rewardType: "quest",
      });

    const vendorRewards = findVendorGems(
      buildData,
      requiredGems,
      routeGems,
      reward_offer.vendor
    );
    for (const vendorReward of vendorRewards) {
      gemSteps.push({
        type: "gem_step",
        requiredGem: requiredGems[vendorReward],
        rewardType: "vendor",
      });
    }
  }

  return gemSteps;
}

function findQuestGem(
  buildData: RouteData.BuildData,
  requiredGems: RouteData.RequiredGem[],
  routeGems: Set<number>,
  quest_rewards: GameData.RewardOffer["quest"]
): number | null {
  for (let i = 0; i < requiredGems.length; i++) {
    const requiredGem = requiredGems[i];
    if (routeGems.has(i)) continue;

    const reward = quest_rewards[requiredGem.id];
    if (!reward) continue;

    const validClass =
      reward.classes.length == 0 ||
      reward.classes.some((x) => x == buildData.characterClass);

    if (validClass) {
      routeGems.add(i);
      return i;
    }
  }

  return null;
}

function findVendorGems(
  buildData: RouteData.BuildData,
  requiredGems: RouteData.RequiredGem[],
  routeGems: Set<number>,
  vendor_rewards: GameData.RewardOffer["vendor"]
): number[] {
  const result: number[] = [];
  for (let i = 0; i < requiredGems.length; i++) {
    const requiredGem = requiredGems[i];
    if (routeGems.has(i)) continue;

    const reward = vendor_rewards[requiredGem.id];
    if (!reward) continue;

    const validClass =
      reward.classes.length == 0 ||
      reward.classes.some((x) => x == buildData.characterClass);

    if (validClass) {
      routeGems.add(i);
      result.push(i);
    }
  }

  return result;
}
