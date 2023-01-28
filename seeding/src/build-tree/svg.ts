import { ParsingTree } from "./types";

const PADDING = 175;

const MASTERY_RADIUS = 55;
const KEYSTONE_RADIUS = 80;
const ASCENDANCY_START_RADIUS = 0;
const ASCENDANCY_NOTABLE_RADIUS = 65;
const ASCENDANCY_NORMAL_RADIUS = 45;
const NORMAL_RADIUS = 50;

const NODE_STROKE_WIDTH = 0;
const CONNECTION_STROKE_WIDTH = 20;

const GROUP_NODE_CLASS = "nodes";
const GROUP_CONNECTION_CLASS = "connections";

const NODE_MASTERY_CLASS = "mastery";
const NODE_KEYSTONE_CLASS = "keystone";
const NODE_ASCENDANCY_CLASS = "ascendancy";
const NODE_NORMAL_CLASS = "normal";

const CONNECTION_ASCENDANCY_CLASS = "ascendancy";
const CONNECTION_NORMAL_CLASS = "";

export function buildTemplate(tree: ParsingTree.Data) {
  let svgTemplate = ``;
  const vbX = tree.bounds.minX - PADDING;
  const vbY = tree.bounds.minY - PADDING;
  const vbW = tree.bounds.maxX - tree.bounds.minX + PADDING * 2;
  const vbH = tree.bounds.maxY - tree.bounds.minY + PADDING * 2;
  svgTemplate += `<svg viewBox="${vbX} ${vbY} ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg">\n`;

  svgTemplate += `<style>
svg {
  background-color: {{ backgroundColor }};
}

.${GROUP_NODE_CLASS} {
  fill: {{ nodeColor }};
  stroke: {{ nodeColor }};
  stroke-width: ${NODE_STROKE_WIDTH};
}

.${GROUP_NODE_CLASS} .${NODE_MASTERY_CLASS} {
  fill: transparent;
  stroke: transparent;
}

.${GROUP_CONNECTION_CLASS} {
  fill: none;
  stroke: {{ connectionColor }};
  stroke-width: ${CONNECTION_STROKE_WIDTH};
}

.${NODE_ASCENDANCY_CLASS} {
  display: none;
}
.ascendancy.{{ ascendancy }} {
  display: unset;
}

{{#each nodes}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}} {
  fill: {{ nodeActiveColor }};
  stroke: {{ nodeActiveColor }};
}

{{#each connections}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}{
  fill: {{ connectionActiveColor }};
  stroke: {{ connectionActiveColor }};
}
</style>\n`;

  svgTemplate += `<g class="${GROUP_CONNECTION_CLASS}">\n`;
  for (const connection of tree.connections) {
    svgTemplate += buildConnection(connection);
  }
  svgTemplate += `</g>\n`;

  svgTemplate += `<g class="${GROUP_NODE_CLASS}">\n`;
  for (const node of tree.nodes) {
    svgTemplate += buildNode(node);
  }
  svgTemplate += `</g>\n`;

  svgTemplate += `</svg>\n`;

  return svgTemplate;
}

function buildNode(node: ParsingTree.Node) {
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

function buildConnection(connection: ParsingTree.Connection) {
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
