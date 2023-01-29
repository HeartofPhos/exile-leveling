import fetch from "cross-fetch";
import { PassiveTree } from "../../../common/data/tree";
import { buildTemplate as buildTemplateSVG } from "./svg";
import { processSkillTree } from "./process-tree";
import { SkillTree } from "./types";

const PASSIVE_TREE_JSON = {
  "3.18":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/85c09648bbb9447474f84f48a942738ce3e5bdb4/data.json",
  "3.19":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/479be10a08d51c0a798cd693701a6bd6300738dc/data.json",
  "3.20":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/d2a0ffa5e15717e0115277f8bd852c6b53371429/data.json",
};

export async function buildTemplates() {
  const result = [];
  for (const [version, url] of Object.entries(PASSIVE_TREE_JSON)) {
    const data: SkillTree.Data = await fetch(url).then((x) => x.json());

    const parsingTree = processSkillTree(data);
    const { template, viewBox } = buildTemplateSVG(parsingTree);

    const passiveTree: PassiveTree.Data = {
      classes: data.classes.map((_class) => ({
        id: _class.name,
        ascendancies: _class.ascendancies.map((asc) => ({
          id: asc.id,
          startNodeId: parsingTree.nodes.filter(
            (x) =>
              x.ascendancy !== undefined &&
              x.ascendancy.kind === "Start" &&
              x.ascendancy.name == asc.name
          )[0].id,
        })),
      })),
      nodes: parsingTree.nodes.map((node) => ({
        id: node.id,
        x: node.position.x,
        y: node.position.y,
      })),
      connections: parsingTree.connections.map((connection) => ({
        a: connection.a.id,
        b: connection.b.id,
      })),
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
