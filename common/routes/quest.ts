import {
  ERROR_INVALID_FORMAT,
  EvaluateResult,
  ParsedAction,
  RouteLookup,
  RouteState,
  Step,
} from ".";
import { Gem, Quest } from "../types";

export interface QuestAction {
  type: "quest";
  questId: Quest["id"];
}

export interface QuestRewardAction {
  type: "quest_reward";
  gemId: string;
}

function PrepareQuestRewardSet(quest: Quest, lookup: RouteLookup) {
  let questRewardSets: Quest["quest_rewards"][];

  //Hack for The Caged Brute
  if (quest.id == "a1q2") {
    questRewardSets = [];
    const setLookup: Record<Gem["required_level"], number> = {};
    for (const key in quest.quest_rewards) {
      const gem = lookup.gems[key];
      if (gem) {
        let index = setLookup[gem.required_level];
        if (index === undefined) {
          index = questRewardSets.length;
          setLookup[gem.required_level] = index;
          questRewardSets.push({});
        }

        questRewardSets[index][key] = quest.quest_rewards[key];
      }
    }

  } else {
    questRewardSets = [quest.quest_rewards];
  }

  return questRewardSets;
}

function tryFindQuestReward(
  lookup: RouteLookup,
  state: RouteState,
  quest_rewards: Quest["quest_rewards"]
): QuestRewardAction | null {
  for (const gemId of lookup.requiredGems) {
    if (state.acquiredGems.has(gemId)) continue;

    const reward = quest_rewards[gemId];
    if (!reward) continue;

    const validClass =
      reward.classes.length == 0 ||
      reward.classes.some((x) => x == lookup.class);

    if (validClass) {
      state.acquiredGems.add(gemId);
      return { type: "quest_reward", gemId: gemId };
    }
  }

  return null;
}

export function EvaluateQuest(
  action: ParsedAction,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  {
    if (action.length != 2) return ERROR_INVALID_FORMAT;

    // TODO data incomplete
    // const quest = state.quests[action[1]];
    // if (!quest) return false;
    const questId = action[1];
    state.recentQuests.push(questId);
    const quest = lookup.quests[questId];

    const additionalSteps: Step[] = [];
    if (quest) {
      const questRewardSets = PrepareQuestRewardSet(quest, lookup);
      for (const quest_rewards of questRewardSets) {
        const reward = tryFindQuestReward(lookup, state, quest_rewards);
        if (reward) {
          additionalSteps.push([reward]);
        }
      }
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

export interface QuestItemAction {
  type: "quest_item";
  value: string;
}

export function EvaluateQuestItem(
  action: ParsedAction,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (action.length != 2) return ERROR_INVALID_FORMAT;
  return {
    action: {
      type: "quest_item",
      value: action[1],
    },
  };
}

export interface QuestTextAction {
  type: "quest_text";
  value: string;
}

function EvaluateQuestText(
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
