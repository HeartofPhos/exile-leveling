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

export const BaseItemTypesDat = parseDat(
  "./exports/Data/BaseItemTypes.dat64.json"
);
export const GrantedEffectsDat = parseDat(
  "./exports/Data/GrantedEffects.dat64.json"
);
export const GrantedEffectsPerLevelDat = parseDat(
  "./exports/Data/GrantedEffectsPerLevel.dat64.json"
);
export const MapPinsDat = parseDat("./exports/Data/MapPins.dat64.json");
export const QuestDat = parseDat("./exports/Data/Quest.dat64.json");
export const RecipeUnlockDisplayDat = parseDat(
  "./exports/Data/RecipeUnlockDisplay.dat64.json"
);
export const SkillGemsDat = parseDat("./exports/Data/SkillGems.dat64.json");
export const WorldAreasDat = parseDat("./exports/Data/WorldAreas.dat64.json");
