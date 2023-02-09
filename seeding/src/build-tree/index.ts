import fetch from "cross-fetch";
import { PassiveTree } from "../../../common/data/tree";
import { buildTemplate as buildTemplateSVG } from "./svg";
import { buildIntermediateTree } from "./tree";
import { SkillTree } from "./types";

const PASSIVE_TREE_JSON = {
  "3_18":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/85c09648bbb9447474f84f48a942738ce3e5bdb4/data.json",
  "3_19":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/479be10a08d51c0a798cd693701a6bd6300738dc/data.json",
  "3_20":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/d2a0ffa5e15717e0115277f8bd852c6b53371429/data.json",
};

export async function buildTemplates() {
  const result = [];
  for (const [version, url] of Object.entries(PASSIVE_TREE_JSON)) {
    const skillTree: SkillTree.Data = await fetch(url).then((x) => x.json());

    const intermediateTree = buildIntermediateTree(skillTree);
    const { template, viewBox } = buildTemplateSVG(intermediateTree);

    const passiveTree: PassiveTree.Data = {
      classes: skillTree.classes.map((_class) => ({
        id: _class.name,
        ascendancies: _class.ascendancies.map((asc) => ({
          id: asc.id,
          startNodeId: intermediateTree.ascendancies[asc.id].startNodeId,
        })),
      })),
      nodes: Object.entries(intermediateTree.nodes).reduce<
        PassiveTree.Data["nodes"]
      >((record, [nodeId, node]) => {
        record[nodeId] = node.position;
        return record;
      }, {}),
      connections: intermediateTree.connections.map((connection) => ({
        a: connection.a,
        b: connection.b,
      })),
      masteryEffects: intermediateTree.masteryEffects,
      viewBox: viewBox,
    };

    result.push({
      version,
      template,
      passiveTree,
    });
  }

  return result;
}
