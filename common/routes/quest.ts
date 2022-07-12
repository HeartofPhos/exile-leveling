import {
  ERROR_INVALID_FORMAT,
  EvaluateResult,
  RawFragment,
  RequiredGem,
  RouteLookup,
  RouteState,
  Step,
} from ".";
import { Quest } from "../types";

import { quests } from "../data";

export interface QuestFragment {
  type: "quest";
  questId: Quest["id"];
}

export interface RewardStep {
  type: "reward_step";
  reward_type: "quest" | "vendor";
  requiredGem: RequiredGem;
}

function tryFindQuestReward(
  lookup: RouteLookup,
  state: RouteState,
  quest_rewards: Quest["quest_rewards"][0]
): Step | null {
  if (lookup.buildData) {
    for (const requiredGem of lookup.buildData.requiredGems) {
      if (state.acquiredGems.has(requiredGem.id)) continue;

      const reward = quest_rewards[requiredGem.id];
      if (!reward) continue;

      const validClass =
        reward.classes.length == 0 ||
        reward.classes.some((x) => x == lookup.buildData?.characterClass);

      if (validClass) {
        state.acquiredGems.add(requiredGem.id);
        return {
          type: "reward_step",
          reward_type: "quest",
          requiredGem: requiredGem,
        };
      }
    }
  }

  return null;
}

function tryFindVendorRewards(
  lookup: RouteLookup,
  state: RouteState,
  vendor_rewards: Quest["vendor_rewards"][0]
): Step[] {
  const result: Step[] = [];
  if (lookup.buildData) {
    for (const requiredGem of lookup.buildData.requiredGems) {
      if (state.acquiredGems.has(requiredGem.id)) continue;

      const reward = vendor_rewards[requiredGem.id];
      if (!reward) continue;

      const validClass =
        reward.classes.length == 0 ||
        reward.classes.some((x) => x == lookup.buildData?.characterClass);

      if (validClass) {
        state.acquiredGems.add(requiredGem.id);
        result.push({
          type: "reward_step",
          reward_type: "vendor",
          requiredGem: requiredGem,
        });
      }
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

    let quest_rewards;
    let vendor_rewards;
    if (rawFragment.length == 2) {
      quest_rewards = quest.quest_rewards;
      vendor_rewards = quest.vendor_rewards;
    } else {
      quest_rewards = [];
      vendor_rewards = [];
      for (let i = 2; i < rawFragment.length; i++) {
        const questRewardIndex = Number.parseInt(rawFragment[i]);
        quest_rewards.push(quest.quest_rewards[questRewardIndex]);
        vendor_rewards.push(quest.vendor_rewards[questRewardIndex]);
      }
    }

    const additionalSteps: Step[] = [];
    for (const rewards of quest_rewards) {
      const questReward = tryFindQuestReward(lookup, state, rewards);
      if (questReward) {
        additionalSteps.push(questReward);
      }
    }
    for (const rewards of vendor_rewards) {
      const vendorRewards = tryFindVendorRewards(lookup, state, rewards).map(
        (x) => x
      );
      additionalSteps.push(...vendorRewards);
    }

    return {
      fragment: {
        type: "quest",
        questId: rawFragment[1],
      },
      additionalSteps: additionalSteps,
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
