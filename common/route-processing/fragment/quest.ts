import { RouteState } from "..";
import { ERROR_INVALID_FORMAT, EvaluateResult, RawFragment } from ".";
import { Quest } from "../../types";

import { quests } from "../../data";

export interface QuestFragment {
  type: "quest";
  questId: Quest["id"];
  rewardOffers: number[];
}

export interface QuestTextFragment {
  type: "quest_text";
  value: string;
}

export function EvaluateQuest(
  rawFragment: RawFragment,
  state: RouteState
): EvaluateResult | string {
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

export function EvaluateQuestText(
  rawFragment: RawFragment,
  state: RouteState
): EvaluateResult | string {
  if (rawFragment.length != 2) return ERROR_INVALID_FORMAT;
  return {
    fragment: {
      type: "quest_text",
      value: rawFragment[1],
    },
  };
}
