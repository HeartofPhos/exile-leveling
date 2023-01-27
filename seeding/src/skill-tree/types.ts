export interface SkillTreeData {
  tree: string;
  classes: Class[];
  groups: Record<string, Group>;
  nodes: Record<string, Node>;
  extraImages: Record<string, ExtraImage>;
  jewelSlots: number[];
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
  constants: Constants;
  sprites: Sprites;
  imageZoomLevels: number[];
  points: Points;
}

export interface Class {
  name: string;
  base_str: number;
  base_dex: number;
  base_int: number;
  ascendancies: AscendancyElement[];
}

export interface AscendancyElement {
  id: string;
  name: string;
  flavourText?: string;
  flavourTextColour?: string;
  flavourTextRect?: FlavourTextRect;
}

export interface FlavourTextRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Constants {
  classes: Classes;
  characterAttributes: CharacterAttributes;
  PSSCentreInnerRadius: number;
  skillsPerOrbit: number[];
  orbitRadii: number[];
}

export interface CharacterAttributes {
  Strength: number;
  Dexterity: number;
  Intelligence: number;
}

export interface Classes {
  StrDexIntClass: number;
  StrClass: number;
  DexClass: number;
  IntClass: number;
  StrDexClass: number;
  StrIntClass: number;
  DexIntClass: number;
}

export interface ExtraImage {
  x: number;
  y: number;
  image: string;
}

export interface Group {
  x: number;
  y: number;
  orbits: number[];
  background?: GroupBackground;
  nodes: string[];
  isProxy?: boolean;
}

export interface GroupBackground {
  image: Image;
  isHalfImage?: boolean;
}

export type Image =
  | "PSGroupBackground3"
  | "PSGroupBackground2"
  | "PSGroupBackground1";

export interface Node {
  skill?: number;
  name?: string;
  icon?: string;
  isNotable?: boolean;
  recipe?: Recipe[];
  stats?: string[];
  group?: number;
  orbit?: number;
  orbitIndex?: number;
  out?: string[];
  in?: string[];
  reminderText?: string[];
  isMastery?: boolean;
  inactiveIcon?: string;
  activeIcon?: string;
  activeEffectImage?: string;
  masteryEffects?: MasteryEffect[];
  grantedStrength?: number;
  ascendancyName?: string;
  grantedDexterity?: number;
  isAscendancyStart?: boolean;
  isMultipleChoice?: boolean;
  grantedIntelligence?: number;
  isJewelSocket?: boolean;
  expansionJewel?: ExpansionJewel;
  grantedPassivePoints?: number;
  isKeystone?: boolean;
  flavourText?: string[];
  isProxy?: boolean;
  isMultipleChoiceOption?: boolean;
  isBlighted?: boolean;
  classStartIndex?: number;
}

export interface ExpansionJewel {
  size: number;
  index: number;
  proxy: string;
  parent?: string;
}

export interface MasteryEffect {
  effect: number;
  stats: string[];
  reminderText?: string[];
}

export type Recipe =
  | "ClearOil"
  | "AzureOil"
  | "BlackOil"
  | "AmberOil"
  | "SepiaOil"
  | "IndigoOil"
  | "OpalescentOil"
  | "TealOil"
  | "VerdantOil"
  | "VioletOil"
  | "GoldenOil"
  | "CrimsonOil"
  | "SilverOil";

export interface Points {
  totalPoints: number;
  ascendancyPoints: number;
}

export interface Sprites {
  background: Record<string, SpriteSheet>;
  normalActive: Record<string, SpriteSheet>;
  notableActive: Record<string, SpriteSheet>;
  keystoneActive: Record<string, SpriteSheet>;
  normalInactive: Record<string, SpriteSheet>;
  notableInactive: Record<string, SpriteSheet>;
  keystoneInactive: Record<string, SpriteSheet>;
  mastery: Record<string, SpriteSheet>;
  masteryConnected: Record<string, SpriteSheet>;
  masteryActiveSelected: Record<string, SpriteSheet>;
  masteryInactive: Record<string, SpriteSheet>;
  masteryActiveEffect: Record<string, SpriteSheet>;
  ascendancyBackground: Record<string, SpriteSheet>;
  ascendancy: Record<string, SpriteSheet>;
  startNode: Record<string, SpriteSheet>;
  groupBackground: Record<string, SpriteSheet>;
  frame: Record<string, SpriteSheet>;
  jewel: Record<string, SpriteSheet>;
  line: Record<string, SpriteSheet>;
  jewelRadius: Record<string, SpriteSheet>;
}

export interface SpriteCoords {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpriteSheet {
  filename: string;
  w: number;
  h: number;
  coords: Record<string, SpriteCoords>;
}
