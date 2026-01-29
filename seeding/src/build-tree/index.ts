import { buildSkillTree } from "./tree";
import { RawTree } from "./types";
import fetch from "cross-fetch";

const PASSIVE_TREE_JSON = {
  "3_18":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/85c09648bbb9447474f84f48a942738ce3e5bdb4/data.json",
  "3_19":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/479be10a08d51c0a798cd693701a6bd6300738dc/data.json",
  "3_20":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/d2a0ffa5e15717e0115277f8bd852c6b53371429/data.json",
  "3_21":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/8c5a952499d7e58e29261f9ae1fd9c4a8b55f6b1/data.json",
  "3_22":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/ec48bb1f5f25cfdc26093904bbf1b2529d18387e/data.json",
  "3_23":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/d1e926cc3b3568750311e7d2e791b2a34efad7c2/data.json",
  "3_24":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/fea1986f746d6c8ba9dfc391c755a91c2ef0baed/data.json",
  "3_25":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/1b435e5003808bd9ff65d732350e393e8ec07159/data.json",
  "3_26":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/9785205dca9cb617ea5a7d77faefd3608693ce77/data.json",
  "3_27":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/326858d90b229d5953f7670b6f2817acefd7bf5d/data.json",
  "3_27_alternate":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/765dda38b9dd21ec28429fd81dd2d17ad6390623/alternate.json",
};

export async function buildTemplates() {
  const result = [];
  for (const [version, url] of Object.entries(PASSIVE_TREE_JSON)) {
    const rawTree: RawTree.Data = await fetch(url).then((x) => x.json());

    const skillTree = buildSkillTree(rawTree);

    result.push({
      version,
      skillTree,
    });
  }

  return result;
}
