import { Data } from "../../../../common/data";
import { RouteData } from "../../../../common/route-processing/types";
import { GameData } from "../../../../common/types";
import { decodeBase64Url, randomId } from "../../utility";
import pako from "pako";

const GEM_ID_REMAP: Record<string, string> = {
  // POB is weird https://github.com/PathOfBuildingCommunity/PathOfBuilding/blob/0d3bdf009c8bc9579eb8cffb5548f03c45e57373/src/Export/Scripts/skills.lua#L504
  "Metadata/Items/Gems/Smite": "Metadata/Items/Gems/SkillGemSmite",
  "Metadata/Items/Gems/ConsecratedPath":
    "Metadata/Items/Gems/SkillGemConsecratedPath",
  "Metadata/Items/Gems/VaalAncestralWarchief":
    "Metadata/Items/Gems/SkillGemVaalAncestralWarchief",
  "Metadata/Items/Gems/HeraldOfAgony":
    "Metadata/Items/Gems/SkillGemHeraldOfAgony",
  "Metadata/Items/Gems/HeraldOfPurity":
    "Metadata/Items/Gems/SkillGemHeraldOfPurity",
  "Metadata/Items/Gems/ScourgeArrow":
    "Metadata/Items/Gems/SkillGemScourgeArrow",
  "Metadata/Items/Gems/RainOfSpores": "Metadata/Items/Gems/SkillGemToxicRain",
  "Metadata/Items/Gems/SummonRelic": "Metadata/Items/Gems/SkillGemSummonRelic",
  // Outdated wiki data?
  "Metadata/Items/Gems/SkillGemNewPhaseRun":
    "Metadata/Items/Gems/SkillGemPhaseRun",
  "Metadata/Items/Gems/SkillGemNewArcticArmour":
    "Metadata/Items/Gems/SkillGemArcticArmour",
};

function MapGemId(gemId: string) {
  const pobRemapId = GEM_ID_REMAP[gemId];
  if (pobRemapId) gemId = pobRemapId;

  const vaalToNormalId = Data.VaalGemLookup[gemId];
  if (vaalToNormalId) gemId = vaalToNormalId;

  const awakenedToNormalId = Data.AwakenedGemLookup[gemId];
  if (awakenedToNormalId) gemId = awakenedToNormalId;

  return gemId;
}

function decodePathOfBuildingCode(code: string) {
  const buffer = pako.inflate(decodeBase64Url(code));

  const decoder = new TextDecoder();
  const xmlString = decoder.decode(buffer);

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");

  return xml;
}

const POB_COLOUR_REGEX = /\^(x[a-zA-Z0-9]{6}|[0-9])/;

function processSkills(
  requiredGems: RouteData.RequiredGem[],
  gemLinks: RouteData.GemLink[],
  character: GameData.Character,
  parentElement: Element,
  parentTitle: string | undefined
) {
  const skillElements = Array.from(parentElement.getElementsByTagName("Skill"));

  let recentEmptySkillLabel: string | undefined;
  for (const skillElement of skillElements) {
    const skillEnabled = skillElement.attributes.getNamedItem("enabled");
    if (!skillEnabled || skillEnabled.value == "false") continue;

    const skillLabel = skillElement.attributes.getNamedItem("label")?.value;

    const gemElements = Array.from(skillElement.getElementsByTagName("Gem"));
    if (gemElements.length == 0) recentEmptySkillLabel = skillLabel;

    let primaryGemIds: string[] = [];
    let secondaryGemIds: string[] = [];
    for (const gemElement of gemElements) {
      const attribute = gemElement.attributes.getNamedItem("gemId");
      if (attribute) {
        const gemId = MapGemId(attribute.value);
        const note = recentEmptySkillLabel || parentTitle || skillLabel || "";
        const gem = {
          id: gemId,
          uid: randomId(6),
          note: note.replace(POB_COLOUR_REGEX, ""),
        };

        if (
          character.start_gem_id !== gemId &&
          character.chest_gem_id !== gemId &&
          !requiredGems.some((x) => x.id === gemId)
        ) {
          requiredGems.push(gem);
        }

        if (Data.Gems[gemId].is_support) secondaryGemIds.push(gemId);
        else primaryGemIds.push(gemId);
      }
    }

    if (primaryGemIds.length > 0)
      gemLinks.push({
        title: recentEmptySkillLabel || parentTitle,
        primaryGemIds: primaryGemIds,
        secondaryGemIds: secondaryGemIds,
      });
    else
      gemLinks.push({
        title: recentEmptySkillLabel || parentTitle,
        primaryGemIds: secondaryGemIds,
        secondaryGemIds: [],
      });
  }
}

export interface PobData {
  buildData: RouteData.BuildData;
  requiredGems: RouteData.RequiredGem[];
  buildTrees: RouteData.BuildTree[];
  gemLinks: RouteData.GemLink[];
}

export function processPob(pobCode: string): PobData | undefined {
  let doc;
  try {
    doc = decodePathOfBuildingCode(pobCode);
  } catch (e) {
    return undefined;
  }

  const buildElement = Array.from(doc.getElementsByTagName("Build"));

  const characterClass =
    buildElement[0].attributes.getNamedItem("className")?.value!;
  const character = Data.Characters[characterClass];

  const bandit =
    buildElement[0].attributes.getNamedItem("bandit")?.value || "None";

  const requiredGems: RouteData.RequiredGem[] = [];
  const gemLinks: RouteData.GemLink[] = [];
  const skillSetElements = Array.from(doc.getElementsByTagName("SkillSet"));
  if (skillSetElements.length > 0) {
    for (const skillSetElement of skillSetElements) {
      processSkills(
        requiredGems,
        gemLinks,
        character,
        skillSetElement,
        skillSetElement.attributes.getNamedItem("title")?.value
      );
    }
  } else {
    processSkills(
      requiredGems,
      gemLinks,
      character,
      doc.documentElement,
      undefined
    );
  }

  const buildTrees: RouteData.BuildTree[] = [];
  const specElements = Array.from(doc.getElementsByTagName("Spec"));
  for (const specElement of specElements) {
    buildTrees.push({
      name: specElement.getAttribute("title")!,
      version: specElement.getAttribute("treeVersion")!,
      url: specElement.getElementsByTagName("URL")[0].textContent?.trim()!,
    });
  }

  return {
    buildData: {
      characterClass: characterClass,
      bandit: bandit as RouteData.BuildData["bandit"],
      leagueStart: true,
      library: true,
      gemLinks: true,
      gemsOnly: false,
    },
    requiredGems,
    buildTrees,
    gemLinks,
  };
}
