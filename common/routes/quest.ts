import {
  BuildData,
  ERROR_INVALID_FORMAT,
  EvaluateResult,
  RawFragment,
  RequiredGem,
  RouteLookup,
  RouteState,
} from ".";
import { Quest } from "../types";

import { quests } from "../data";

export interface QuestFragment {
  type: "quest";
  questId: Quest["id"];
  rewardOffers: number[];
}

export function findGems(
  questFragment: QuestFragment,
  buildData: BuildData,
  acquiredGems: Set<number>
) {
  const quest = quests[questFragment.questId];

  let questGems = [];
  let vendorGems = [];
  for (const index of questFragment.rewardOffers) {
    const reward_offer = quest.reward_offers[index];

    const questReward = findQuestGem(
      buildData,
      acquiredGems,
      reward_offer.quest
    );
    if (questReward !== null) questGems.push(questReward);

    const vendorRewards = findVendorGems(
      buildData,
      acquiredGems,
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
  acquiredGems: Set<number>,
  quest_rewards: Quest["reward_offers"][0]["quest"]
): number | null {
  for (let i = 0; i < buildData.requiredGems.length; i++) {
    const requiredGem = buildData.requiredGems[i];
    if (acquiredGems.has(i)) continue;

    const reward = quest_rewards[requiredGem.id];
    if (!reward) continue;

    const validClass =
      reward.classes.length == 0 ||
      reward.classes.some((x) => x == buildData.characterClass);

    if (validClass) {
      acquiredGems.add(i);
      return i;
    }
  }

  return null;
}

function findVendorGems(
  buildData: BuildData,
  acquiredGems: Set<number>,
  vendor_rewards: Quest["reward_offers"][0]["vendor"]
): number[] {
  const result: number[] = [];
  for (let i = 0; i < buildData.requiredGems.length; i++) {
    const requiredGem = buildData.requiredGems[i];
    if (acquiredGems.has(i)) continue;

    const reward = vendor_rewards[requiredGem.id];
    if (!reward) continue;

    const validClass =
      reward.classes.length == 0 ||
      reward.classes.some((x) => x == buildData.characterClass);

    if (validClass) {
      acquiredGems.add(i);
      result.push(i);
    }
  }

  return result;
}

export function EvaluateQuest(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  {
    if (rawFragment.length < 2) return ERROR_INVALID_FORMAT;

    const questId = rawFragment[1];
    const quest = quests[questId];
    if (!quest) return "invalid quest id";

    let rewardOfferIds;
    if (rawFragment.length == 2) {
      rewardOfferIds = quest.reward_offers.map((v, i) => i);
    } else {
      rewardOfferIds = [];
      for (let i = 2; i < rawFragment.length; i++) {
        const questRewardIndex = Number.parseInt(rawFragment[i]);
        rewardOfferIds.push(questRewardIndex);
      }
    }

    return {
      fragment: {
        type: "quest",
        questId: rawFragment[1],
        rewardOffers: rewardOfferIds,
      },
    };
  }
}

export interface QuestTextFragment {
  type: "quest_text";
  value: string;
}

export function EvaluateQuestText(
  rawFragment: RawFragment,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "quest_text",
      value: rawFragment[1],
    },
  };
}
