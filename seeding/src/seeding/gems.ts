import { GameData } from "../../../common/types";
import {
  BaseItemTypesDat,
  GrantedEffectsDat,
  GrantedEffectsPerLevelDat,
  SkillGemsDat,
} from "../../data";

function getGemCost(required_level: number) {
  if (required_level < 8) return "CurrencyIdentification";
  if (required_level < 16) return "CurrencyUpgradeToMagic";
  if (required_level < 28) return "CurrencyRerollMagic";
  if (required_level < 38) return "CurrencyUpgradeRandomly";
  return "CurrencyUpgradeToRare";
}

const ATTRIBUTE_LOOKUP: Record<number, string> = {
  [1]: "strength",
  [2]: "dexterity",
  [3]: "intelligence",
  [4]: "none",
};

export async function getGems() {
  const gems: GameData.Gems = {};
  const awakenedGemLookup: GameData.VariantGemLookup = {};
  const vaalGemLookup: GameData.VariantGemLookup = {};
  for (const skillGem of SkillGemsDat.data) {
    const baseItemType = BaseItemTypesDat.data[skillGem.BaseItemTypesKey];
    if (!baseItemType.SiteVisibility) continue;

    const grantedEffects = GrantedEffectsDat.data[skillGem.GrantedEffectsKey];
    const grantedEffectsPerLevel = GrantedEffectsPerLevelDat.data.find(
      (x) => x.Level == 1 && x.GrantedEffect == skillGem.GrantedEffectsKey
    );

    gems[baseItemType.Id] = {
      id: baseItemType.Id,
      name: baseItemType.Name,
      primary_attribute: ATTRIBUTE_LOOKUP[grantedEffects.Attribute],
      required_level: grantedEffectsPerLevel.PlayerLevelReq,
      cost: getGemCost(grantedEffectsPerLevel.PlayerLevelReq),
    };

    if (skillGem.VaalVariant_BaseItemTypesKey !== null) {
      const vaalBaseItemType =
        BaseItemTypesDat.data[skillGem.VaalVariant_BaseItemTypesKey];
      vaalGemLookup[vaalBaseItemType.Id] = baseItemType.Id;
    }

    if (skillGem.AwakenedVariant !== null) {
      const awakenedSkillGem = SkillGemsDat.data[skillGem.AwakenedVariant];

      const awakenedBaseItemType =
        BaseItemTypesDat.data[awakenedSkillGem.BaseItemTypesKey];
      awakenedGemLookup[awakenedBaseItemType.Id] = baseItemType.Id;
    }
  }

  return {
    gems: gems,
    vaalGemLookup: vaalGemLookup,
    awakenedGemLookup: awakenedGemLookup,
  };
}
