import { PassiveTree } from "../../../../common/data/tree";

const PADDING = 550;

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
const BORDER_CLASS = "border";

type ConstantsLookup = Partial<Record<PassiveTree.Node["k"], Constants>>;

interface Constants {
  radius: number;
  class?: string;
}

const TREE_CONSTANTS: ConstantsLookup = {
  Mastery: {
    radius: 55,
    class: NODE_MASTERY_CLASS,
  },
  Keystone: {
    radius: 80,
    class: NODE_KEYSTONE_CLASS,
  },
  Notable: {
    radius: 65,
    class: NODE_NOTABLE_CLASS,
  },
  Normal: {
    radius: 45,
    class: NODE_NORMAL_CLASS,
  },
};

const ASCENDANCY_CONSTANTS: ConstantsLookup = {
  Ascendancy_Start: {
    radius: 30,
  },
  Notable: {
    radius: 65,
    class: NODE_NOTABLE_CLASS,
  },
  Normal: {
    radius: 45,
    class: NODE_NORMAL_CLASS,
  },
};

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function buildTemplate(tree: PassiveTree.Data) {
  const viewBox: ViewBox = {
    x: tree.bounds.minX - PADDING,
    y: tree.bounds.minY - PADDING,
    w: tree.bounds.maxX - tree.bounds.minX + PADDING * 2,
    h: tree.bounds.maxY - tree.bounds.minY + PADDING * 2,
  };

  let svg = ``;
  svg += `<svg width="${viewBox.w}" height="${viewBox.h}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}" xmlns="http://www.w3.org/2000/svg">\n`;

  svg += buildSubTree(tree.nodes, tree.connections, TREE_CONSTANTS);

  for (const [, ascendancy] of Object.entries(tree.ascendancies)) {
    svg += buildAscendancy(ascendancy);
  }

  svg += `</svg>\n`;

  const styleTemplate = `
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

#{{ svgId }} .${ASCENDANCY_CLASS} {
  opacity: 0.4;
}

{{#if ascendancy}}
#{{ svgId }} .${ASCENDANCY_CLASS}.{{ ascendancy }} {
  opacity: unset;
}
{{/if}}

#{{ svgId }} .${BORDER_CLASS} {
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
}`;

  return { svg, viewBox, styleTemplate };
}

function buildSubTree(
  nodes: Record<string, PassiveTree.Node>,
  connections: PassiveTree.Connection[],
  constantsLookup: ConstantsLookup
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
  node: PassiveTree.Node,
  constantsLookup: ConstantsLookup
) {
  const constants = constantsLookup[node.k];
  if (constants === undefined) throw `missing constant, ${node.k}`;

  return `<circle cx="${node.x}" cy="${node.y}" id="n${nodeId}" r="${constants.radius}" class="${constants.class}"/>\n`;
}

function buildConnection(
  connection: PassiveTree.Connection,
  nodes: Record<string, PassiveTree.Node>
) {
  const id = [connection.a, connection.b].sort().join("-");

  const nodeA = nodes[connection.a];
  const aX = nodeA.x;
  const aY = nodeA.y;

  const nodeB = nodes[connection.b];
  const bX = nodeB.x;
  const bY = nodeB.y;

  if (connection.s !== undefined) {
    const d = connection.s.w === "CW" ? 1 : 0;
    const r = connection.s.r;
    return `<path d="M ${aX} ${aY} A ${r} ${r} 0 0 ${d} ${bX} ${bY}" id="c${id}" />\n`;
  } else {
    return `<line x1="${aX}" y1="${aY}" x2="${bX}" y2="${bY}" id="c${id}" />\n`;
  }
}

function buildAscendancy(ascendancy: PassiveTree.Ascendancy) {
  let template = ``;

  const startNode = ascendancy.nodes[ascendancy.startNodeId];
  const radius =
    ascendancy.name === "Ascendant"
      ? ASCENDANCY_ASCENDANT_BORDER_RADIUS
      : ASCENDANCY_BORDER_RADIUS;

  template += `<g class="${ASCENDANCY_CLASS} ${ascendancy.name}">`;
  template += `<circle cx="${startNode.x}" cy="${startNode.y}" r="${radius}" class="${BORDER_CLASS}"/>\n`;
  template += buildSubTree(
    ascendancy.nodes,
    ascendancy.connections,
    ASCENDANCY_CONSTANTS
  );
  template += `</g>`;

  return template;
}
