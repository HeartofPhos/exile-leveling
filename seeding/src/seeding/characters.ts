import { GameData } from "../../../common/types";
import { Dat } from "../data";

const CHARACTER_CHEST_GEMS: Record<string, string> = {
  ["Marauder"]: "Metadata/Items/Gems/SupportGemRuthless",
  ["Witch"]: "Metadata/Items/Gems/SupportGemArcaneSurge",
  ["Scion"]: "Metadata/Items/Gems/SupportGemOnslaught",
  ["Ranger"]: "Metadata/Items/Gems/SupportGemPierce",
  ["Duelist"]: "Metadata/Items/Gems/SupportGemChanceToBleed",
  ["Shadow"]: "Metadata/Items/Gems/SupportGemLesserPoison",
  ["Templar"]: "Metadata/Items/Gems/SupportGemElementalProliferation",
};

export async function getCharacters() {
  const characters: GameData.Characters = {};
  for (const character of Dat.Characters.data) {
    const skillGem = Dat.SkillGems.data[character.StartSkillGem];
    const skillGemBaseItemType =
      Dat.BaseItemTypes.data[skillGem.BaseItemTypesKey];

    characters[character.Name] = {
      start_gem_id: skillGemBaseItemType.Id,
      chest_gem_id: CHARACTER_CHEST_GEMS[character.Name],
    };
  }

  return characters;
}
