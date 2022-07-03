import classNames from "classnames";
import pako from "pako";
import { useEffect, useState } from "react";
import { ExileList } from "../../components/ExileList";
import { GemOrder } from "../../components/GemOrder";
import { BuildData } from "../../../../common/routes";
import styles from "./Build.module.css";

import gems from "../../data/gems.json";

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

function getGem(gemId: string) {
  const remap = POB_GEM_ID_REMAP[gemId];
  if (remap) return gems[remap];
  return gems[gemId];
}

export function Gems() {
  const [buildData, setBuildData] = useState<BuildData>();
  const [pobCode, setPobCode] = useState<string>();

  useEffect(() => {
    const fn = async () => {
      if (pobCode) {
        const doc = decodePathOfBuildingCode(pobCode);
        const gemElements = Array.from(doc.getElementsByTagName("Gem"));
        const gemIds = [];
        for (const element of gemElements) {
          const attribute = element.attributes.getNamedItem("gemId");
          if (attribute) gemIds.push(attribute.value);
        }
        const distinctGemIds = gemIds.filter((v, i, a) => a.indexOf(v) === i);

        const buildElement = Array.from(doc.getElementsByTagName("Build"));
        const characterClass =
          buildElement[0].attributes.getNamedItem("className")?.value;

        setBuildData({
          characterClass: characterClass!,
          requiredGems: distinctGemIds,
        });
      } else {
        const buildDataJson = localStorage.getItem("build-data");
        if (buildDataJson) setBuildData(JSON.parse(buildDataJson));
      }
    };

    fn();
  }, [pobCode]);

  return (
    <div>
      <div className={classNames(styles.gemForm)}>
        Path of Building Code:
        <input
          className={classNames(styles.input)}
          onChange={(e) => setPobCode(e.target.value)}
          type="text"
        />
        <button
          className={classNames(styles.input)}
          onClick={() => {
            if (buildData)
              localStorage.setItem("build-data", JSON.stringify(buildData));
          }}
        >
          Save
        </button>
        <button
          className={classNames(styles.input)}
          onClick={() => {
            const buildDataJson = localStorage.getItem("build-data");
            if (buildDataJson) setBuildData(JSON.parse(buildDataJson));
          }}
        >
          Reset
        </button>
      </div>
      <ExileList
        header="Gems"
        items={
          buildData &&
          gems &&
          buildData.requiredGems.map((x, i) => (
            <GemOrder
              onMoveTop={() => {
                const splice = buildData.requiredGems.splice(i, 1);
                buildData.requiredGems.unshift(...splice);
                setBuildData({
                  ...buildData,
                });
              }}
              onMoveUp={() => {
                if (i == 0) return;

                const swap = buildData.requiredGems[i];
                buildData.requiredGems[i] = buildData.requiredGems[i - 1];
                buildData.requiredGems[i - 1] = swap;

                setBuildData({
                  ...buildData,
                });
              }}
              onMoveDown={() => {
                if (i == buildData.requiredGems.length - 1) return;

                const swap = buildData.requiredGems[i];
                buildData.requiredGems[i] = buildData.requiredGems[i + 1];
                buildData.requiredGems[i + 1] = swap;

                setBuildData({
                  ...buildData,
                });
              }}
              onDelete={() => {
                buildData.requiredGems.splice(i, 1);
                setBuildData({
                  ...buildData,
                });
              }}
              gem={getGem(x)}
            />
          ))
        }
      />
    </div>
  );
}
