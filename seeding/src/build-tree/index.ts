import fetch from "cross-fetch";
import { parseSkillTree } from "./tree";
import { ExileTree, SkillTree } from "./types";

const PASSIVE_TREE_JSON = {
  "3.18":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/85c09648bbb9447474f84f48a942738ce3e5bdb4/data.json",
  "3.19":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/479be10a08d51c0a798cd693701a6bd6300738dc/data.json",
  "3.20":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/d2a0ffa5e15717e0115277f8bd852c6b53371429/data.json",
};

const PADDING = 175;

const FILL = "#000000";
const STROKE = "#000000";
const STROKE_WIDTH = 20;

const MASTERY_RADIUS = 55;
const KEYSTONE_RADIUS = 80;
const ASCENDANCY_START_RADIUS = 0;
const ASCENDANCY_NOTABLE_RADIUS = 65;
const ASCENDANCY_NORMAL_RADIUS = 45;
const NORMAL_RADIUS = 50;

const GROUP_NODE_CLASS = "nodes";
const GROUP_CONNECTION_CLASS = "connections";

const NODE_MASTERY_CLASS = "mastery";
const NODE_KEYSTONE_CLASS = "keystone";
const NODE_ASCENDANCY_CLASS = "ascendancy";
const NODE_NORMAL_CLASS = "normal";

const CONNECTION_ASCENDANCY_CLASS = "ascendancy";
const CONNECTION_NORMAL_CLASS = "";

export async function buildSVG(version: keyof typeof PASSIVE_TREE_JSON) {
  const data: SkillTree.Data = await fetch(PASSIVE_TREE_JSON[version]).then(
    (x) => x.json()
  );

  const tree = parseSkillTree(data);

  let svg = ``;
  const vbX = tree.bounds.minX - PADDING;
  const vbY = tree.bounds.minY - PADDING;
  const vbW = tree.bounds.maxX - tree.bounds.minX + PADDING * 2;
  const vbH = tree.bounds.maxY - tree.bounds.minY + PADDING * 2;
  svg += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${vbW} ${vbH}">\n`;

  svg += `<style>
.${NODE_ASCENDANCY_CLASS} {
  display: none;
}
.ascendancy.Saboteur {
  display: block;
}
</style>\n`;

  svg += `<g class="${GROUP_NODE_CLASS}" stroke="${STROKE}" fill="${FILL}">\n`;
  for (const node of tree.nodes) {
    svg += buildNode(node);
  }
  svg += `</g>\n`;

  svg += `<g class="${GROUP_CONNECTION_CLASS}" fill="none" stroke-width="${STROKE_WIDTH}" stroke="${STROKE}">\n`;
  for (const connection of tree.connections) {
    svg += buildConnection(connection);
  }
  svg += `</g>\n`;

  svg += `</svg>\n`;

  return svg;
}

function buildNode(node: ExileTree.Node) {
  let attrs;
  if (node.kind == "Mastery")
    attrs = `r="${MASTERY_RADIUS}" class="${NODE_MASTERY_CLASS}"`;
  else if (node.kind == "Keystone")
    attrs = `r="${KEYSTONE_RADIUS}" class="${NODE_KEYSTONE_CLASS}"`;
  else if (node.kind == "Ascendancy" && node.ascendancy !== undefined) {
    if (node.ascendancy.kind === "Start")
      attrs = `r="${ASCENDANCY_START_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancy.ascendancyName}"`;
    else if (node.ascendancy.kind === "Notable")
      attrs = `r="${ASCENDANCY_NOTABLE_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancy.ascendancyName}"`;
    else if (node.ascendancy.kind === "Normal")
      attrs = `r="${ASCENDANCY_NORMAL_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancy.ascendancyName}"`;
  } else if (node.kind === "Normal")
    attrs = `r="${NORMAL_RADIUS}" class="${NODE_NORMAL_CLASS}"`;

  return `<circle cx="${node.position.x}" cy="${node.position.y}" id="n${node.id}" ${attrs}/>\n`;
}

function buildConnection(connection: ExileTree.Connection) {
  const id = [connection.a.id, connection.b.id].sort().join("-");
  const a = connection.a.position;
  const b = connection.b.position;

  let attrs;
  if (
    connection.a.kind === "Ascendancy" &&
    connection.a.ascendancy !== undefined
  )
    attrs = `class="${CONNECTION_ASCENDANCY_CLASS} ${connection.a.ascendancy.ascendancyName}"`;
  else attrs = `class="${CONNECTION_NORMAL_CLASS}"`;

  if (connection.path.sweep !== undefined) {
    const sweep = connection.path.sweep === "CW" ? 1 : 0;
    const r = connection.path.radius;
    return `<path d="M ${a.x} ${a.y} A ${r} ${r} 0 0 ${sweep} ${b.x} ${b.y}" id="c${id}" ${attrs} />\n`;
  } else {
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" id="c${id}" ${attrs} />\n`;
  }
}
