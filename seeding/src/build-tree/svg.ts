import { PassiveTree } from "../../../common/data/tree";
import { ProcessedTree } from "./types";

const PADDING = 0;

const MASTERY_RADIUS = 55;
const KEYSTONE_RADIUS = 80;
const ASCENDANCY_START_RADIUS = 30;
const ASCENDANCY_NOTABLE_RADIUS = 65;
const ASCENDANCY_NORMAL_RADIUS = 45;
const NORMAL_RADIUS = 50;

const NODE_STROKE_WIDTH = 0;
const CONNECTION_STROKE_WIDTH = 20;
const CONNECTION_ACTIVE_STROKE_WIDTH = 35;

const GROUP_NODE_CLASS = "nodes";
const GROUP_CONNECTION_CLASS = "connections";

const NODE_MASTERY_CLASS = "mastery";
const NODE_KEYSTONE_CLASS = "keystone";
const NODE_ASCENDANCY_CLASS = "ascendancy";
const NODE_NORMAL_CLASS = "normal";

const CONNECTION_ASCENDANCY_CLASS = "ascendancy";
const CONNECTION_NORMAL_CLASS = "";

export function buildTemplate(tree: ProcessedTree.Data) {
  let template = ``;

  const width = tree.bounds.maxX - tree.bounds.minX;
  const height = tree.bounds.maxY - tree.bounds.minY;

  // More consistent across browsers
  const size = Math.max(width, height);

  const viewBox: PassiveTree.ViewBox = {
    x: tree.bounds.minX - PADDING,
    y: tree.bounds.minY - PADDING,
    w: size + PADDING * 2,
    h: size + PADDING * 2,
    padding: PADDING,
  };

  template += `<svg viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}" xmlns="http://www.w3.org/2000/svg">\n`;

  template += `<style>
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
{{#if ascendancy}}
.ascendancy.{{ ascendancy }} {
  display: unset;
}
{{/if}}

{{#each nodesActive}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}} {
  fill: {{ nodeActiveColor }};
  stroke: {{ nodeActiveColor }};
}

{{#each nodesAdded}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}} {
  fill: {{ nodeAddedColor }};
  stroke: {{ nodeAddedColor }};
}

{{#each nodesRemoved}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}} {
  fill: {{ nodeRemovedColor }};
  stroke: {{ nodeRemovedColor }};
}

{{#each connectionsActive}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}{
  stroke: {{ connectionActiveColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}

{{#each connectionsAdded}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}{
  stroke: {{ connectionAddedColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}

{{#each connectionsRemoved}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}{
  stroke: {{ connectionRemovedColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}
</style>\n`;

  template += `<g class="${GROUP_CONNECTION_CLASS}">\n`;
  for (const connection of tree.connections) {
    template += buildConnection(connection);
  }
  template += `</g>\n`;

  template += `<g class="${GROUP_NODE_CLASS}">\n`;
  for (const node of tree.nodes) {
    template += buildNode(node);
  }
  template += `</g>\n`;

  template += `</svg>\n`;

  return { template, viewBox };
}

function buildNode(node: ProcessedTree.Node) {
  let attrs;
  if (node.kind == "Mastery")
    attrs = `r="${MASTERY_RADIUS}" class="${NODE_MASTERY_CLASS}"`;
  else if (node.kind == "Keystone")
    attrs = `r="${KEYSTONE_RADIUS}" class="${NODE_KEYSTONE_CLASS}"`;
  else if (node.kind == "Ascendancy" && node.ascendancy !== undefined) {
    if (node.ascendancy.kind === "Start")
      attrs = `r="${ASCENDANCY_START_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancy.name}"`;
    else if (node.ascendancy.kind === "Notable")
      attrs = `r="${ASCENDANCY_NOTABLE_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancy.name}"`;
    else if (node.ascendancy.kind === "Normal")
      attrs = `r="${ASCENDANCY_NORMAL_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancy.name}"`;
  } else if (node.kind === "Normal")
    attrs = `r="${NORMAL_RADIUS}" class="${NODE_NORMAL_CLASS}"`;

  return `<circle cx="${node.position.x}" cy="${node.position.y}" id="n${node.id}" ${attrs}/>\n`;
}

function buildConnection(connection: ProcessedTree.Connection) {
  const id = [connection.a.id, connection.b.id].sort().join("-");
  const a = connection.a.position;
  const b = connection.b.position;

  let attrs;
  if (
    connection.a.kind === "Ascendancy" &&
    connection.a.ascendancy !== undefined
  )
    attrs = `class="${CONNECTION_ASCENDANCY_CLASS} ${connection.a.ascendancy.name}"`;
  else attrs = `class="${CONNECTION_NORMAL_CLASS}"`;

  if (connection.path.sweep !== undefined) {
    const sweep = connection.path.sweep === "CW" ? 1 : 0;
    const r = connection.path.radius;
    return `<path d="M ${a.x} ${a.y} A ${r} ${r} 0 0 ${sweep} ${b.x} ${b.y}" id="c${id}" ${attrs} />\n`;
  } else {
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" id="c${id}" ${attrs} />\n`;
  }
}
