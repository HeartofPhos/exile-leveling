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
  return JSON.parse(fs.readFileSync(`${__dirname}/${path}`, "utf-8"));
}

export const BaseItemTypesDat = parseDat("./exports/Data/BaseItemTypes.dat.json");
export const SkillGemsDat = parseDat("./exports/Data/SkillGems.dat.json");
export const GrantedEffectsDat = parseDat("./exports/Data/GrantedEffects.dat.json");
export const GrantedEffectsPerLevelDat = parseDat(
  "./exports/Data/GrantedEffectsPerLevel.dat.json"
);
export const QuestDat = parseDat("./exports/Data/Quest.dat.json");
export const WorldAreasDat = parseDat("./exports/Data/WorldAreas.dat.json");
export const RecipeUnlockDisplayDat = parseDat(
  "./exports/Data/RecipeUnlockDisplay.dat.json"
);
