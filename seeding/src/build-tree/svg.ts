import { PassiveTree } from "../../../common/data/tree";
import { IntermediateTree } from "./types";

const PADDING = 550;

const ASCENDANCY_START_RADIUS = 30;
const ASCENDANCY_NOTABLE_RADIUS = 65;
const ASCENDANCY_NORMAL_RADIUS = 45;
const MASTERY_RADIUS = 55;
const KEYSTONE_RADIUS = 80;
const NOTABLE_RADIUS = 65;
const NORMAL_RADIUS = 45;

const ASCENDANCY_BORDER_RADIUS = 650;
const ASCENDANCY_ASCENDANT_BORDER_RADIUS = 750;

const NODE_STROKE_WIDTH = 0;
const CONNECTION_STROKE_WIDTH = 20;
const CONNECTION_ACTIVE_STROKE_WIDTH = 35;

const GROUP_NODE_CLASS = "nodes";
const GROUP_CONNECTION_CLASS = "connections";

const NODE_MASTERY_CLASS = "mastery";
const NODE_KEYSTONE_CLASS = "keystone";
const NODE_NOTABLE_CLASS = "notable";
const NODE_NORMAL_CLASS = "normal";

const ASCENDANCY_CLASS = "ascendancy";
const ASCENDANCY_BORDER_CLASS = "ascendancy-border";

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

#{{ svgId }} .${ASCENDANCY_BORDER_CLASS} {
  fill: none;
  stroke: {{ connectionColor }};
  stroke-width: ${CONNECTION_STROKE_WIDTH};
}

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

  template += buildSubTree(tree.nodes, tree.connections, TREE_CONSTANTS);

  for (const [, ascendancy] of Object.entries(tree.ascendancies)) {
    template += buildAscendancy(ascendancy);
  }

  template += `</svg>\n`;

  return { template, viewBox };
}

type ConstantsLookup = Partial<
  Record<IntermediateTree.Node["kind"], Constants>
>;
interface Constants {
  radius: number;
  class?: string;
}

const TREE_CONSTANTS: ConstantsLookup = {
  Mastery: {
    radius: MASTERY_RADIUS,
    class: NODE_MASTERY_CLASS,
  },
  Keystone: {
    radius: KEYSTONE_RADIUS,
    class: NODE_KEYSTONE_CLASS,
  },
  Notable: {
    radius: NOTABLE_RADIUS,
    class: NODE_NOTABLE_CLASS,
  },
  Normal: {
    radius: NORMAL_RADIUS,
    class: NODE_NORMAL_CLASS,
  },
};

const ASCENDANCY_CONSTANTS: ConstantsLookup = {
  Ascendancy_Start: {
    radius: ASCENDANCY_START_RADIUS,
  },
  Normal: {
    radius: ASCENDANCY_NORMAL_RADIUS,
    class: NODE_NORMAL_CLASS,
  },
  Notable: {
    radius: ASCENDANCY_NOTABLE_RADIUS,
    class: NODE_NOTABLE_CLASS,
  },
};

function buildSubTree(
  nodes: Record<string, IntermediateTree.Node>,
  connections: IntermediateTree.Connection[],
  constantsLookup: Record<string, Constants>
) {
  let template = ``;

  template += `<g class="${GROUP_CONNECTION_CLASS}">\n`;
  for (const connection of connections) {
    template += buildConnection(connection, nodes);
  }
  template += `</g>\n`;

  template += `<g class="${GROUP_NODE_CLASS}">\n`;
  for (const [nodeId, node] of Object.entries(nodes)) {
    template += buildNode(nodeId, node, constantsLookup);
  }
  template += `</g>\n`;

  return template;
}

function buildNode(
  nodeId: string,
  node: IntermediateTree.Node,
  constantsLookup: ConstantsLookup
) {
  const constants = constantsLookup[node.kind];
  return `<circle cx="${node.position.x}" cy="${node.position.y}" id="n${nodeId}" r="${constants?.radius}" class="${constants?.class}"/>\n`;
}

function buildConnection(
  connection: IntermediateTree.Connection,
  nodes: Record<string, IntermediateTree.Node>
) {
  const id = [connection.a, connection.b].sort().join("-");

  const nodeA = nodes[connection.a];
  const aX = nodeA.position.x;
  const aY = nodeA.position.y;

  const nodeB = nodes[connection.b];
  const bX = nodeB.position.x;
  const bY = nodeB.position.y;

  if (connection.path.sweep !== undefined) {
    const sweep = connection.path.sweep === "CW" ? 1 : 0;
    const r = connection.path.radius;
    return `<path d="M ${aX} ${aY} A ${r} ${r} 0 0 ${sweep} ${bX} ${bY}" id="c${id}" />\n`;
  } else {
    return `<line x1="${aX}" y1="${aY}" x2="${bX}" y2="${bY}" id="c${id}" />\n`;
  }
}

function buildAscendancy(ascendancy: IntermediateTree.Ascendancy) {
  let template = ``;

  const startNode = ascendancy.nodes[ascendancy.startNodeId];
  const radius =
    ascendancy.name === "Ascendant"
      ? ASCENDANCY_ASCENDANT_BORDER_RADIUS
      : ASCENDANCY_BORDER_RADIUS;

  template += `<g class="${ASCENDANCY_CLASS} ${ascendancy.name}">`;
  template += `<circle cx="${startNode.position.x}" cy="${startNode.position.y}" r="${radius}" class="${ASCENDANCY_BORDER_CLASS}"/>\n`;
  template += buildSubTree(
    ascendancy.nodes,
    ascendancy.connections,
    ASCENDANCY_CONSTANTS
  );
  template += `</g>`;

  return template;
}
