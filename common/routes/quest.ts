import {
  ERROR_INVALID_FORMAT,
  EvaluateResult,
  ParsedAction,
  RequiredGem,
  RouteLookup,
  RouteState,
  Step,
} from ".";
import { Quest, QuestReward } from "../types";

export interface QuestAction {
  type: "quest";
  questId: Quest["id"];
}

export interface QuestRewardAction {
  type: "quest_reward";
  requiredGem: RequiredGem;
}

export interface VendorRewardAction {
  type: "vendor_reward";
  requiredGem: RequiredGem;
}

function tryFindQuestReward(
  lookup: RouteLookup,
  state: RouteState,
  quest_rewards: Record<string, QuestReward>
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
        return [{ type: "quest_reward", requiredGem: requiredGem }];
      }
    }
  }

  return null;
}

function tryFindVendorRewards(
  lookup: RouteLookup,
  state: RouteState,
  vendor_rewards: Quest["vendor_rewards"]
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
        result.push([
          {
            type: "vendor_reward",
            requiredGem: requiredGem,
          },
        ]);
      }
    }
  }

  return result;
}

export function EvaluateQuest(
  action: ParsedAction,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  {
    if (action.length != 2) return ERROR_INVALID_FORMAT;

    const questId = action[1];
    const quest = lookup.quests[questId];
    if (!quest) return "invalid quest id";

    const additionalSteps: Step[] = [];
    if (quest) {
      for (const quest_rewards of quest.quest_rewards) {
        const questReward = tryFindQuestReward(lookup, state, quest_rewards);
        if (questReward) {
          additionalSteps.push(questReward);
        }
      }

      const vendorRewards = tryFindVendorRewards(
        lookup,
        state,
        quest.vendor_rewards
      ).map((x) => x);

      additionalSteps.push(...vendorRewards);
    }

    return {
      action: {
        type: "quest",
        questId: action[1],
      },
      additionalSteps: additionalSteps,
    };
  }
}

export interface QuestTextAction {
  type: "quest_text";
  value: string;
}

export function EvaluateQuestText(
  action: ParsedAction,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (action.length != 2) return ERROR_INVALID_FORMAT;
  return {
    action: {
      type: "quest_text",
      value: action[1],
    },
  };
}
