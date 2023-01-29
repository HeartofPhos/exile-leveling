import { ProcessedTree, SkillTree } from "./types";

export const ANGLES_16: number[] = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330,
];
export const ANGLES_40: number[] = [
  0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 135, 140, 150,
  160, 170, 180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 270, 280, 290,
  300, 310, 315, 320, 330, 340, 350,
];

const TWO_PI = Math.PI * 2;
const DEG_2_RAD = Math.PI / 180;

function getPosition(data: SkillTree.Data, node: SkillTree.Node) {
  const radius = data.constants.orbitRadii[node.orbit!];
  const skillsPerOrbit = data.constants.skillsPerOrbit[node.orbit!];
  const orbitIndex = node.orbitIndex || 0;
  const group = data.groups[node.group!];

  let angle: number;
  if (skillsPerOrbit == 16) angle = ANGLES_16[orbitIndex] * DEG_2_RAD;
  else if (skillsPerOrbit == 40) angle = ANGLES_40[orbitIndex] * DEG_2_RAD;
  else angle = (TWO_PI / skillsPerOrbit) * orbitIndex;

  let x = group.x + radius * Math.sin(angle);
  let y = group.y - radius * Math.cos(angle);

  return [angle % TWO_PI, Math.round(x), Math.round(y)];
}

export function processSkillTree(data: SkillTree.Data) {
  const parsingTree: ProcessedTree.Data = {
    bounds: {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
    nodes: [],
    connections: [],
  };

  const updateMinxMax = (x: number, y: number) => {
    parsingTree.bounds.minX = Math.min(parsingTree.bounds.minX, x);
    parsingTree.bounds.minY = Math.min(parsingTree.bounds.minY, y);
    parsingTree.bounds.maxX = Math.max(parsingTree.bounds.maxX, x);
    parsingTree.bounds.maxY = Math.max(parsingTree.bounds.maxY, y);
  };

  const tempAscendancies: Record<
    string,
    {
      startNode: string;
      startPosition: ProcessedTree.Coord;
      nodes: ProcessedTree.Node[];
      connections: ProcessedTree.Connection[];
    }
  > = {};

  for (const [, group] of Object.entries(data.groups)) {
    if (!filterGroup(group)) continue;

    for (const nodeId of group.nodes) {
      const node = data.nodes[nodeId];
      if (!filterNode(node)) continue;

      const [angle, x, y] = getPosition(data, node);

      const treeNode = {
        id: nodeId,
        position: { x, y },
        kind: nodeKind(node),
        ascendancy: ascendancyNode(node),
      };

      let nodes: ProcessedTree.Node[];
      let connections: ProcessedTree.Connection[];
      if (treeNode.kind === "Ascendancy") {
        let asc = tempAscendancies[node.ascendancyName!];
        if (asc === undefined) {
          asc = {
            startNode: "",
            startPosition: { x: 0, y: 0 },
            nodes: [],
            connections: [],
          };
          tempAscendancies[node.ascendancyName!] = asc;
        }

        if (node.isAscendancyStart) {
          asc.startNode = nodeId;
          asc.startPosition = { x, y };
        }

        nodes = asc.nodes;
        connections = asc.connections;
      } else {
        updateMinxMax(x, y);

        nodes = parsingTree.nodes;
        connections = parsingTree.connections;
      }

      nodes.push(treeNode);

      const outNodes =
        node.out?.map((outNodeId) => ({
          outNodeId,
          outNode: data.nodes[outNodeId],
        })) || [];
      for (const { outNodeId, outNode } of outNodes) {
        if (!filterConnection(node, outNode)) continue;

        let [outAngle, outX, outY] = getPosition(data, outNode);

        let path: ProcessedTree.Path;
        if (node.group === outNode.group && node.orbit === outNode.orbit) {
          const radius = data.constants.orbitRadii[node.orbit!];

          let rot = (angle - outAngle + TWO_PI) % TWO_PI;
          let sweep: ProcessedTree.Sweep["sweep"];
          if (rot > Math.PI) sweep = "CW";
          else sweep = "CCW";

          path = { sweep: sweep, radius: radius };
        } else {
          path = { sweep: undefined };
        }

        connections.push({
          a: treeNode,
          b: {
            id: outNodeId,
            position: { x: outX, y: outY },
            kind: nodeKind(outNode),
            ascendancy: ascendancyNode(outNode),
          },
          path: path,
        });
      }
    }
  }

  const ASCENDANCY_POS_X = 7000;
  const ASCENDANCY_POS_Y = -7700;
  for (const [, asc] of Object.entries(tempAscendancies)) {
    const diff_x = ASCENDANCY_POS_X - asc.startPosition.x;
    const diff_y = ASCENDANCY_POS_Y - asc.startPosition.y;

    const updateNode = (node: ProcessedTree.Node) => {
      node.position.x += diff_x;
      node.position.y += diff_y;
    };

    for (const node of asc.nodes) {
      updateNode(node);
      updateMinxMax(node.position.x, node.position.y);
      parsingTree.nodes.push(node);
    }

    for (const connection of asc.connections) {
      updateNode(connection.b);
      parsingTree.connections.push(connection);
    }
  }

  return parsingTree;
}

function filterGroup(group: SkillTree.Group) {
  return !group.isProxy;
}

function filterNode(node: SkillTree.Node) {
  return node.classStartIndex === undefined;
}

function filterConnection(a: SkillTree.Node, b: SkillTree.Node) {
  return (
    filterNode(b) &&
    !a.isMastery &&
    !b.isMastery &&
    (a.ascendancyName === undefined) === (b.ascendancyName === undefined)
  );
}

function nodeKind(node: SkillTree.Node): ProcessedTree.Node["kind"] {
  if (node.isKeystone) return "Keystone";
  if (node.isMastery) return "Mastery";
  if (node.ascendancyName !== undefined) return "Ascendancy";

  return "Normal";
}

function ascendancyNode(
  node: SkillTree.Node
): ProcessedTree.AscendancyNode | undefined {
  if (node.ascendancyName === undefined) return undefined;

  let kind: ProcessedTree.AscendancyNode["kind"];
  if (node.isAscendancyStart) kind = "Start";
  else if (node.isNotable) kind = "Notable";
  else kind = "Normal";

  return {
    name: node.ascendancyName,
    kind: kind,
  };
}
