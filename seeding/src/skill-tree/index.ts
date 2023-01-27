import fetch from "cross-fetch";
import { SkillTreeData } from "./types";

const PASSIVE_TREE_JSON = {
  "3.18":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/85c09648bbb9447474f84f48a942738ce3e5bdb4/data.json",
  "3.19":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/479be10a08d51c0a798cd693701a6bd6300738dc/data.json",
  "3.20":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/d2a0ffa5e15717e0115277f8bd852c6b53371429/data.json",
};

export async function parsePassiveTree(
  version: keyof typeof PASSIVE_TREE_JSON
) {
  const data: SkillTreeData = await fetch(PASSIVE_TREE_JSON[version]).then(
    (x) => x.json()
  );

  for (const treeClass of data.classes) {
    console.log(treeClass.name);
  }
}
