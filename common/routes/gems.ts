import { BuildData } from ".";
import { quests } from "../data";
import { Gem, Quest } from "../types";
import { QuestFragment } from "./fragment/quest";

export interface GemStep {
  type: "gem_step";
  gem: Gem;
  rewardType: "quest" | "vendor";
}

export function findGems(
  questFragment: QuestFragment,
  buildData: BuildData,
  routeGems: Set<number>
) {
  const quest = quests[questFragment.questId];

  let questGems: number[] = [];
  let vendorGems: number[] = [];
  for (const index of questFragment.rewardOffers) {
    const reward_offer = quest.reward_offers[index];

    const questReward = findQuestGem(buildData, routeGems, reward_offer.quest);
    if (questReward !== null) questGems.push(questReward);

    const vendorRewards = findVendorGems(
      buildData,
      routeGems,
      reward_offer.vendor
    );
    for (const vendorReward of vendorRewards) {
      vendorGems.push(vendorReward);
    }
  }

  return {
    questGems,
    vendorGems,
  };
}

function findQuestGem(
  buildData: BuildData,
  routeGems: Set<number>,
  quest_rewards: Quest["reward_offers"][0]["quest"]
): number | null {
  for (let i = 0; i < buildData.requiredGems.length; i++) {
    const requiredGem = buildData.requiredGems[i];
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
  routeGems: Set<number>,
  vendor_rewards: Quest["reward_offers"][0]["vendor"]
): number[] {
  const result: number[] = [];
  for (let i = 0; i < buildData.requiredGems.length; i++) {
    const requiredGem = buildData.requiredGems[i];
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
