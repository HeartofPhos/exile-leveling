import fetch from "cross-fetch";
import { buildTemplate as buildTemplateSVG } from "./svg";
import { parseSkillTree } from "./tree";
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

    const { parsingTree, passiveTree } = parseSkillTree(data);
    const template = buildTemplateSVG(parsingTree);

    result.push({
      version,
      template,
      passiveTree,
    });
  }

  return result;
}
