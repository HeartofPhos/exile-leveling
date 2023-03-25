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
    "./exports/Data/BaseItemTypes.dat64.json"
  );
  export const Characters = parseDat("./exports/Data/Characters.dat64.json");
  export const GrantedEffects = parseDat(
    "./exports/Data/GrantedEffects.dat64.json"
  );
  export const GrantedEffectsPerLevel = parseDat(
    "./exports/Data/GrantedEffectsPerLevel.dat64.json"
  );
  export const MapPins = parseDat("./exports/Data/MapPins.dat64.json");
  export const NPCs = parseDat("./exports/Data/NPCs.dat64.json");
  export const NPCTalk = parseDat("./exports/Data/NPCTalk.dat64.json");
  export const Quest = parseDat("./exports/Data/Quest.dat64.json");
  export const QuestRewardOffers = parseDat(
    "./exports/Data/QuestRewardOffers.dat64.json"
  );
  export const QuestRewards = parseDat(
    "./exports/Data/QuestRewards.dat64.json"
  );
  export const RecipeUnlockDisplay = parseDat(
    "./exports/Data/RecipeUnlockDisplay.dat64.json"
  );
  export const SkillGems = parseDat("./exports/Data/SkillGems.dat64.json");
  export const WorldAreas = parseDat("./exports/Data/WorldAreas.dat64.json");
}
