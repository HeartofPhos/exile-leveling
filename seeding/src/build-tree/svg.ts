import { PassiveTree } from "../../../common/data/tree";
import { IntermediateTree } from "./types";

const PADDING = 175;

const ASCENDANCY_START_RADIUS = 30;
const ASCENDANCY_NOTABLE_RADIUS = 65;
const ASCENDANCY_NORMAL_RADIUS = 45;
const MASTERY_RADIUS = 55;
const KEYSTONE_RADIUS = 80;
const NOTABLE_RADIUS = 65;
const NORMAL_RADIUS = 45;

const NODE_STROKE_WIDTH = 0;
const CONNECTION_STROKE_WIDTH = 20;
const CONNECTION_ACTIVE_STROKE_WIDTH = 35;

const GROUP_NODE_CLASS = "nodes";
const GROUP_CONNECTION_CLASS = "connections";

const NODE_ASCENDANCY_CLASS = "ascendancy";
const NODE_MASTERY_CLASS = "mastery";
const NODE_KEYSTONE_CLASS = "keystone";
const NODE_NOTABLE_CLASS = "notable";
const NODE_NORMAL_CLASS = "normal";

const CONNECTION_ASCENDANCY_CLASS = "ascendancy";
const CONNECTION_NORMAL_CLASS = "";

export function buildTemplate(tree: IntermediateTree.Data) {
  let template = ``;

  const viewBox: PassiveTree.ViewBox = {
    x: tree.bounds.minX - PADDING,
    y: tree.bounds.minY - PADDING,
    w: tree.bounds.maxX - tree.bounds.minX + PADDING * 2,
    h: tree.bounds.maxY - tree.bounds.minY + PADDING * 2,
  };

  template += `<svg id="{{ svgId }}" width="${viewBox.w}" height="${viewBox.h}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}" xmlns="http://www.w3.org/2000/svg">\n`;

  template += `<style>
#{{ svgId }} {
  background-color: {{ backgroundColor }};
}

#{{ svgId }} .${GROUP_NODE_CLASS} {
  fill: {{ nodeColor }};
  stroke: {{ nodeColor }};
  stroke-width: ${NODE_STROKE_WIDTH};
}

#{{ svgId }} .${GROUP_NODE_CLASS} .${NODE_MASTERY_CLASS} {
  fill: transparent;
  stroke: transparent;
}

#{{ svgId }} .${GROUP_CONNECTION_CLASS} {
  fill: none;
  stroke: {{ connectionColor }};
  stroke-width: ${CONNECTION_STROKE_WIDTH};
}

#{{ svgId }} .${NODE_ASCENDANCY_CLASS} {
  display: none;
}
{{#if ascendancy}}
#{{ svgId }} .ascendancy.{{ ascendancy }} {
  display: unset;
}
{{/if}}

#{{ svgId }} :is({{#each nodesActive}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  fill: {{ nodeActiveColor }};
  stroke: {{ nodeActiveColor }};
}

#{{ svgId }} :is({{#each nodesAdded}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  fill: {{ nodeAddedColor }};
  stroke: {{ nodeAddedColor }};
}

#{{ svgId }} :is({{#each nodesRemoved}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  fill: {{ nodeRemovedColor }};
  stroke: {{ nodeRemovedColor }};
}

#{{ svgId }} :is({{#each connectionsActive}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  stroke: {{ connectionActiveColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}

#{{ svgId }} :is({{#each connectionsAdded}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  stroke: {{ connectionAddedColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}

#{{ svgId }} :is({{#each connectionsRemoved}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  stroke: {{ connectionRemovedColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}
</style>\n`;

  template += `<g class="${GROUP_CONNECTION_CLASS}">\n`;
  for (const connection of tree.connections) {
    template += buildConnection(connection, tree);
  }
  template += `</g>\n`;

  template += `<g class="${GROUP_NODE_CLASS}">\n`;
  for (const [nodeId, node] of Object.entries(tree.nodes)) {
    template += buildNode(nodeId, node);
  }
  template += `</g>\n`;

  template += `</svg>\n`;

  return { template, viewBox };
}

function buildNode(nodeId: string, node: IntermediateTree.Node) {
  let attrs;
  switch (node.kind) {
    case "Ascendancy":
      {
        if (node.ascendancyKind === "Start")
          attrs = `r="${ASCENDANCY_START_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancyName}"`;
        else if (node.ascendancyKind === "Notable")
          attrs = `r="${ASCENDANCY_NOTABLE_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancyName}"`;
        else if (node.ascendancyKind === "Normal")
          attrs = `r="${ASCENDANCY_NORMAL_RADIUS}" class="${NODE_ASCENDANCY_CLASS} ${node.ascendancyName}"`;
      }
      break;
    case "Mastery":
      {
        attrs = `r="${MASTERY_RADIUS}" class="${NODE_MASTERY_CLASS}"`;
      }
      break;
    case "Keystone":
      {
        attrs = `r="${KEYSTONE_RADIUS}" class="${NODE_KEYSTONE_CLASS}"`;
      }
      break;
    case "Notable":
      {
        attrs = `r="${NOTABLE_RADIUS}" class="${NODE_NOTABLE_CLASS}"`;
      }
      break;
    case "Normal":
      {
        attrs = `r="${NORMAL_RADIUS}" class="${NODE_NORMAL_CLASS}"`;
      }
      break;
  }

  return `<circle cx="${node.position.x}" cy="${node.position.y}" id="n${nodeId}" ${attrs}/>\n`;
}

function buildConnection(
  connection: IntermediateTree.Connection,
  tree: IntermediateTree.Data
) {
  const id = [connection.a, connection.b].sort().join("-");

  const nodeA = tree.nodes[connection.a];
  const aX = nodeA.position.x;
  const aY = nodeA.position.y;

  const nodeB = tree.nodes[connection.b];
  const bX = nodeB.position.x;
  const bY = nodeB.position.y;

  let attrs;
  if (nodeA.kind === "Ascendancy" && nodeA.ascendancyName !== undefined)
    attrs = `class="${CONNECTION_ASCENDANCY_CLASS} ${nodeA.ascendancyName}"`;
  else attrs = `class="${CONNECTION_NORMAL_CLASS}"`;

  if (connection.path.sweep !== undefined) {
    const sweep = connection.path.sweep === "CW" ? 1 : 0;
    const r = connection.path.radius;
    return `<path d="M ${aX} ${aY} A ${r} ${r} 0 0 ${sweep} ${bX} ${bY}" id="c${id}" ${attrs} />\n`;
  } else {
    return `<line x1="${aX}" y1="${aY}" x2="${bX}" y2="${bY}" id="c${id}" ${attrs} />\n`;
  }
}
