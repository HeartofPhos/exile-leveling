import fs from "fs";

interface DatJson {
  columns: {
    name: string;
    type: string;
    references: null;
  }[];
  data: any[];
}

function parseDat(path: string): DatJson {
  const filePath = `${__dirname}/${path}`;
  if (fs.existsSync(filePath))
    return JSON.parse(fs.readFileSync(`${__dirname}/${path}`, "utf-8"));

  return null!;
}

export namespace Dat {
  export const BaseItemTypes = parseDat(
    "../../exports/data/BaseItemTypes.datc64.json"
  );
  export const Characters = parseDat(
    "../../exports/data/Characters.datc64.json"
  );
  export const GemEffects = parseDat(
    "../../exports/data/GemEffects.datc64.json"
  );
  export const GrantedEffects = parseDat(
    "../../exports/data/GrantedEffects.datc64.json"
  );
  export const GrantedEffectsPerLevel = parseDat(
    "../../exports/data/GrantedEffectsPerLevel.datc64.json"
  );
  export const MapPins = parseDat("../../exports/data/MapPins.datc64.json");
  export const NPCs = parseDat("../../exports/data/NPCs.datc64.json");
  export const NPCTalk = parseDat("../../exports/data/NPCTalk.datc64.json");
  export const Quest = parseDat("../../exports/data/Quest.datc64.json");
  export const QuestRewardOffers = parseDat(
    "../../exports/data/QuestRewardOffers.datc64.json"
  );
  export const QuestRewards = parseDat(
    "../../exports/data/QuestRewards.datc64.json"
  );
  export const RecipeUnlockDisplay = parseDat(
    "../../exports/data/RecipeUnlockDisplay.datc64.json"
  );
  export const SkillGems = parseDat("../../exports/data/SkillGems.datc64.json");
  export const WorldAreas = parseDat(
    "../../exports/data/WorldAreas.datc64.json"
  );
}
