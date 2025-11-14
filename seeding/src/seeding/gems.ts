import { GameData } from "../../../common/types";
import { Dat } from "../data";

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
  for (const skillGem of Dat.SkillGems.data) {
    const baseItemType = Dat.BaseItemTypes.data[skillGem.BaseItemTypesKey];

    const gemEffects = Dat.GemEffects.data[skillGem.GemEffects[0]];
    const grantedEffects = Dat.GrantedEffects.data[gemEffects.GrantedEffect];
    const grantedEffectsPerLevel = Dat.GrantedEffectsPerLevel.data.find(
      (x) => x.Level == 1 && x.GrantedEffect == gemEffects.GrantedEffect
    );

    if (!grantedEffectsPerLevel) {
      console.log(`skip gem - ${baseItemType.Id}`);
      continue;
    }

    gems[baseItemType.Id] = {
      id: baseItemType.Id,
      name: baseItemType.Name,
      primary_attribute: ATTRIBUTE_LOOKUP[grantedEffects.Attribute],
      required_level: grantedEffectsPerLevel.PlayerLevelReq,
      is_support: skillGem.IsSupport,
    };

    if (skillGem.VaalVariant_BaseItemTypesKey !== null) {
      const vaalBaseItemType =
        Dat.BaseItemTypes.data[skillGem.VaalVariant_BaseItemTypesKey];
      vaalGemLookup[vaalBaseItemType.Id] = baseItemType.Id;
    }

    if (skillGem.AwakenedVariant !== null) {
      const awakenedSkillGem = Dat.SkillGems.data[skillGem.AwakenedVariant];

      const awakenedBaseItemType =
        Dat.BaseItemTypes.data[awakenedSkillGem.BaseItemTypesKey];
      awakenedGemLookup[awakenedBaseItemType.Id] = baseItemType.Id;
    }
  }

  return {
    gems: gems,
    vaalGemLookup: vaalGemLookup,
    awakenedGemLookup: awakenedGemLookup,
  };
}
