import { BuildData, RequiredGem } from ".";
import { quests } from "../data";
import { Quest } from "../types";
import { QuestFragment } from "./fragment/quest";

export interface GemStep {
  type: "gem_step";
  requiredGem: RequiredGem;
  rewardType: "quest" | "vendor";
}

export function buildGemSteps(
  questFragment: QuestFragment,
  buildData: BuildData,
  requiredGems: RequiredGem[],
  routeGems: Set<number>
) {
  const quest = quests[questFragment.questId];

  const gemSteps: GemStep[] = [];
  for (const index of questFragment.rewardOffers) {
    const reward_offer = quest.reward_offers[index];

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
  buildData: BuildData,
  requiredGems: RequiredGem[],
  routeGems: Set<number>,
  quest_rewards: Quest["reward_offers"][0]["quest"]
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
  buildData: BuildData,
  requiredGems: RequiredGem[],
  routeGems: Set<number>,
  vendor_rewards: Quest["reward_offers"][0]["vendor"]
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
