import fetch from "cross-fetch";
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

export async function buildSVG(version: keyof typeof PASSIVE_TREE_JSON) {
  const data: SkillTree.Data = await fetch(PASSIVE_TREE_JSON[version]).then(
    (x) => x.json()
  );

  const tree = parseSkillTree(data);

  const stroke = "#000000";
  const fill = "#000000";

  let svg = ``;
  const vbX = tree.bounds.minX;
  const vbY = tree.bounds.minY;
  const vbW = tree.bounds.maxX - tree.bounds.minX;
  const vbH = tree.bounds.maxY - tree.bounds.minY;
  svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}">\n`;

  svg += `<g class="nodes" stroke="${stroke}" fill="${fill}">\n`;
  for (const node of tree.nodes) {
    svg += `<circle cx="${node.position.x}" cy="${node.position.y}" id="n${node.id}" r="50"/>\n`;
  }
  svg += `</g>\n`;

  svg += `<g class="connections" fill="none" stroke-width="20" stroke="${stroke}">\n`;
  for (const connection of tree.connections) {
    // const id = [connection.a.id, connection.b.id].sort().join("-");
    const id = "";
    const a = connection.a.position;
    const b = connection.b.position;

    const elementClass = `class=""`;
    if (connection.path.sweep !== undefined) {
      const sweep = connection.path.sweep === "CW" ? 1 : 0;
      const r = connection.path.radius;
      svg += `<path d="M ${a.x} ${a.y} A ${r} ${r} 0 0 ${sweep} ${b.x} ${b.y}" id="c${id}" ${elementClass} />\n`;
    } else {
      svg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" id="c${id}" ${elementClass} />\n`;
    }
  }
  svg += `</g>\n`;

  svg += `</svg>\n`;

  return svg;
}
