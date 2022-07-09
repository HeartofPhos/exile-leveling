import QUEST from "./exports/Quest.dat.json";
import BASE_ITEM_TYPES from "./exports/BaseItemTypes.dat.json";
import SKILL_GEMS from "./exports/SkillGems.dat.json";
import GRANTED_EFFECTS from "./exports/GrantedEffects.dat.json";
import GRANTED_EFFECTS_PER_LEVEL from "./exports/GrantedEffectsPerLevel.dat.json";
import WORLD_AREAS from "./exports/WorldAreas.dat.json";

interface DatJson {
  columns: {
    name: string;
    type: string;
    references: null;
  }[];
  data: any[];
}

export const QuestDat = QUEST as DatJson;
export const BaseItemTypesDat = BASE_ITEM_TYPES as DatJson;
export const SkillGemsDat = SKILL_GEMS as DatJson;
export const GrantedEffectsDat = GRANTED_EFFECTS as DatJson;
export const GrantedEffectsPerLevelDat = GRANTED_EFFECTS_PER_LEVEL as DatJson;
export const WorldAreasDat = WORLD_AREAS as DatJson;
