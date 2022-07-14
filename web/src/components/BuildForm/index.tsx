import classNames from "classnames";
import pako from "pako";
import { useState } from "react";
import { BuildData } from "../../../../common/routes";
import styles from "./BuildForm.module.css";

// https://github.com/PathOfBuildingCommunity/PathOfBuilding/blob/0d3bdf009c8bc9579eb8cffb5548f03c45e57373/src/Export/Scripts/skills.lua#L504
const POB_GEM_ID_REMAP: Record<string, string> = {
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
};

type ImportType = "RECENT_EMPTY_SKILL_LABEL" | "FIRST_SKILL_LABEL";

function decodePathOfBuildingCode(code: string) {
  const base64 = code.replace(/_/g, "/").replace(/-/g, "+");
  const base64_bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const inflated = pako.inflate(base64_bytes);

  const decoder = new TextDecoder();
  const xmlString = decoder.decode(inflated);

  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");

  return xml;
}

const POB_COLOUR_REGEX = /\^(x[a-zA-Z0-9]{6}|[0-9])/;

function processPob(
  pobCode: string | undefined,
  importType: ImportType
): BuildData | undefined {
  let doc;
  try {
    if (!pobCode) return undefined;
    doc = decodePathOfBuildingCode(pobCode);
  } catch (e) {
    return undefined;
  }

  const requiredGems: BuildData["requiredGems"] = [];
  const skillElements = Array.from(doc.getElementsByTagName("Skill"));

  let recentEmptySkillLabel = "";
  for (const skillElement of skillElements) {
    const skillEnabled = skillElement.attributes.getNamedItem("enabled");
    if (!skillEnabled || skillEnabled.value == "false") continue;
    const skillLabel =
      skillElement.attributes.getNamedItem("label")?.value || "";

    const gemElements = Array.from(skillElement.getElementsByTagName("Gem"));
    if (gemElements.length == 0) recentEmptySkillLabel = skillLabel;
    for (const gemElement of gemElements) {
      const attribute = gemElement.attributes.getNamedItem("gemId");
      if (attribute) {
        let gemId = POB_GEM_ID_REMAP[attribute.value];
        if (!gemId) gemId = attribute.value;

        if (!requiredGems.some((x) => x.id == gemId)) {
          let note;
          switch (importType) {
            case "RECENT_EMPTY_SKILL_LABEL":
              note = recentEmptySkillLabel;
              break;
            case "FIRST_SKILL_LABEL":
              note = skillLabel;
              break;
          }

          requiredGems.push({
            id: gemId,
            uid: Math.random(),
            note: note.replace(POB_COLOUR_REGEX, ""),
            acquired: false,
          });
        }
      }
    }
  }

  const buildElement = Array.from(doc.getElementsByTagName("Build"));
  const characterClass =
    buildElement[0].attributes.getNamedItem("className")?.value;

  return {
    characterClass: characterClass!,
    requiredGems: requiredGems,
  };
}

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
  onReset: () => void;
}

export function BuildForm({ onSubmit, onReset }: BuildFormProps) {
  const [pobCode, setPobCode] = useState<string>();

  return (
    <div className={classNames(styles.form)}>
      <div className={classNames(styles.formRow)}>
        <label>Path of Building Code</label>
        <div className={classNames(styles.formInput)}>
          <textarea
            spellCheck={false}
            className={classNames(styles.textarea)}
            value={pobCode || ""}
            onChange={(e) => setPobCode(e.target.value)}
          />
        </div>
      </div>
      <div className={classNames(styles.buttonRow)}>
        <button
          className={classNames(styles.formButton)}
          onClick={() => {
            setPobCode(undefined);
            onReset();
          }}
        >
          Reset
        </button>
        <button
          className={classNames(styles.formButton)}
          onClick={() => {
            const buildData = processPob(pobCode, "RECENT_EMPTY_SKILL_LABEL");
            if (buildData) onSubmit(buildData);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
