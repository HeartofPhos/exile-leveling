import {
  ERROR_INVALID_FORMAT,
  EvaluateResult,
  ParsedAction,
  RouteLookup,
  RouteState,
  Step,
} from ".";
import { Gem } from "../types";

export interface VendorAction {
  type: "vendor";
}

export interface VendorRewardAction {
  type: "vendor_reward";
  gemId: Gem["id"];
}

export function EvaluateVendor(
  action: ParsedAction,
  lookup: RouteLookup,
  state: RouteState
): string | EvaluateResult {
  if (action.length != 1) return ERROR_INVALID_FORMAT;

  const steps: Step[] = [];
  for (const questId of state.recentQuests) {
    const quest = lookup.quests[questId];
    if (!quest) continue;

    for (const gemId of lookup.requiredGems) {
      if (state.acquiredGems.has(gemId)) continue;

      const reward = quest.vendor_rewards[gemId];
      if (!reward) continue;

      const validClass =
        reward.classes.length == 0 ||
        reward.classes.some((x) => x == lookup.class);

      if (validClass) {
        state.acquiredGems.add(gemId);
        steps.push([
          {
            type: "vendor_reward",
            gemId: gemId,
          },
        ]);
      }
    }
  }

  state.recentQuests.length = 0;

  return {
    action: { type: "vendor" },
    additionalSteps: steps,
  };
}
