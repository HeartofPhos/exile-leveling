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

export const BaseItemTypesDat = parseDat("./exports/BaseItemTypes.dat.json");
export const SkillGemsDat = parseDat("./exports/SkillGems.dat.json");
export const GrantedEffectsDat = parseDat("./exports/GrantedEffects.dat.json");
export const GrantedEffectsPerLevelDat = parseDat(
  "./exports/GrantedEffectsPerLevel.dat.json"
);
export const QuestDat = parseDat("./exports/Quest.dat.json");
export const QuestRewardOffersDat = parseDat(
  "./exports/QuestRewardOffers.dat.json"
);
export const QuestRewardsDat = parseDat("./exports/QuestRewards.dat.json");
export const WorldAreasDat = parseDat("./exports/WorldAreas.dat.json");
