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
    radius: 50,
    class: NODE_MASTERY_CLASS,
  },
  Keystone: {
    radius: 75,
    class: NODE_KEYSTONE_CLASS,
  },
  Notable: {
    radius: 60,
    class: NODE_NOTABLE_CLASS,
  },
  Jewel: {
    radius: 60,
    class: NODE_NOTABLE_CLASS,
  },
  Normal: {
    radius: 40,
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

export function buildTemplate(
  tree: PassiveTree.Data,
  nodeLookup: PassiveTree.NodeLookup
) {
  const viewBox: ViewBox = {
    x: tree.bounds.minX - PADDING,
    y: tree.bounds.minY - PADDING,
    w: tree.bounds.maxX - tree.bounds.minX + PADDING * 2,
    h: tree.bounds.maxY - tree.bounds.minY + PADDING * 2,
  };

  let svg = ``;
  svg += `<svg width="${viewBox.w}" height="${viewBox.h}" viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}" xmlns="http://www.w3.org/2000/svg">\n`;

  svg += buildSubTree(tree.graphs[tree.graphIndex], nodeLookup, TREE_CONSTANTS);

  for (const [, ascendancy] of Object.entries(tree.ascendancies)) {
    const startNode = nodeLookup[ascendancy.startNodeId];
    const radius =
      ascendancy.name === "Ascendant"
        ? ASCENDANCY_ASCENDANT_BORDER_RADIUS
        : ASCENDANCY_BORDER_RADIUS;

    svg += `<g class="${ASCENDANCY_CLASS} ${ascendancy.name}">\n`;
    svg += `<circle cx="${startNode.x}" cy="${startNode.y}" r="${radius}" class="${BORDER_CLASS}"/>\n`;
    svg += buildSubTree(
      tree.graphs[ascendancy.graphIndex],
      nodeLookup,
      ASCENDANCY_CONSTANTS
    );
    svg += `</g>\n`;
  }

  svg += `</svg>\n`;

  const styleTemplate = `
#{{ styleId }} {
  background-color: {{ backgroundColor }};
}

#{{ styleId }} .${GROUP_NODE_CLASS} {
  fill: {{ nodeColor }};
  stroke: {{ nodeColor }};
  stroke-width: ${NODE_STROKE_WIDTH};
}

#{{ styleId }} .${GROUP_NODE_CLASS} .${NODE_MASTERY_CLASS} {
  fill: transparent;
  stroke: transparent;
}

#{{ styleId }} .${GROUP_CONNECTION_CLASS} {
  fill: none;
  stroke: {{ connectionColor }};
  stroke-width: ${CONNECTION_STROKE_WIDTH};
}

#{{ styleId }} .${ASCENDANCY_CLASS} {
  opacity: 0.4;
}

{{#if ascendancy}}
#{{ styleId }} .${ASCENDANCY_CLASS}.{{ ascendancy }} {
  opacity: unset;
}
{{/if}}

#{{ styleId }} .${BORDER_CLASS} {
  fill: none;
  stroke: {{ connectionColor }};
  stroke-width: ${CONNECTION_STROKE_WIDTH};
}

#{{ styleId }} :is({{#each nodesActive}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  fill: {{ nodeActiveColor }};
  stroke: {{ nodeActiveColor }};
}

#{{ styleId }} :is({{#each nodesAdded}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  fill: {{ nodeAddedColor }};
  stroke: {{ nodeAddedColor }};
}

#{{ styleId }} :is({{#each nodesRemoved}}#n{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  fill: {{ nodeRemovedColor }};
  stroke: {{ nodeRemovedColor }};
}

#{{ styleId }} :is({{#each connectionsActive}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  stroke: {{ connectionActiveColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}

#{{ styleId }} :is({{#each connectionsAdded}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  stroke: {{ connectionAddedColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}

#{{ styleId }} :is({{#each connectionsRemoved}}#c{{this}}{{#unless @last}}, {{/unless}}{{/each}}) {
  stroke: {{ connectionRemovedColor }};
  stroke-width: ${CONNECTION_ACTIVE_STROKE_WIDTH};
}`;

  return { svg, viewBox, styleTemplate };
}

function buildSubTree(
  graph: PassiveTree.Graph,
  nodeLookup: PassiveTree.NodeLookup,
  constantsLookup: ConstantsLookup
) {
  let template = ``;

  template += `<g class="${GROUP_CONNECTION_CLASS}">\n`;
  for (const connection of graph.connections) {
    template += buildConnection(connection, nodeLookup);
  }
  template += `</g>\n`;

  template += `<g class="${GROUP_NODE_CLASS}">\n`;
  for (const [nodeId, node] of Object.entries(graph.nodes)) {
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

  let template = ``;
  template += `<circle cx="${node.x}" cy="${node.y}" id="n${nodeId}" r="${constants.radius}" class="${constants.class}">\n`;
  if (node.text) template += `<title>${node.text}</title>\n`;
  template += `</circle>\n`;

  return template;
}

function buildConnection(
  connection: PassiveTree.Connection,
  nodeLookup: PassiveTree.NodeLookup
) {
  const id = `${connection.a}-${connection.b}`;

  const nodeA = nodeLookup[connection.a];
  const aX = nodeA.x;
  const aY = nodeA.y;

  const nodeB = nodeLookup[connection.b];
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
