import { IntermediateTree, SkillTree } from "./types";

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

export function processSkillTree(skillTree: SkillTree.Data) {
  const tree: IntermediateTree.Data = {
    bounds: {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
    nodes: {},
    connections: [],
    ascendancies: {},
    masteryEffects: {},
  };

  for (const _class of skillTree.classes) {
    for (const ascendancy of _class.ascendancies) {
      // @ts-expect-error
      tree.ascendancies[ascendancy.name] = {
        nodeIds: [],
      };
    }
  }

  const updateMinxMax = (x: number, y: number) => {
    tree.bounds.minX = Math.min(tree.bounds.minX, x);
    tree.bounds.minY = Math.min(tree.bounds.minY, y);
    tree.bounds.maxX = Math.max(tree.bounds.maxX, x);
    tree.bounds.maxY = Math.max(tree.bounds.maxY, y);
  };

  for (const [, group] of Object.entries(skillTree.groups)) {
    if (!filterGroup(group)) continue;

    for (const nodeId of group.nodes) {
      const node = skillTree.nodes[nodeId];
      if (!filterNode(node)) continue;

      if (node.isMastery) {
        for (const masteryEffect of node.masteryEffects!) {
          tree.masteryEffects[masteryEffect.effect] = {
            stats: masteryEffect.stats,
          };
        }
      }

      const [angle, x, y] = getPosition(skillTree, node);

      const treeNode = buildNode(nodeId, { x, y }, node);

      if (treeNode.kind === "Ascendancy") {
        const asc = tree.ascendancies[node.ascendancyName!];
        if (node.isAscendancyStart) asc.startNodeId = nodeId;
        asc.nodeIds.push(nodeId);
      } else {
        updateMinxMax(x, y);
      }

      tree.nodes[nodeId] = treeNode;

      const outNodeIds = node.out || [];
      for (const outNodeId of outNodeIds) {
        const outNode = skillTree.nodes[outNodeId];
        if (!filterConnection(node, outNode)) continue;

        let [outAngle] = getPosition(skillTree, outNode);

        let path: IntermediateTree.Path;
        if (node.group === outNode.group && node.orbit === outNode.orbit) {
          const radius = skillTree.constants.orbitRadii[node.orbit!];
          const rot = (angle - outAngle + TWO_PI) % TWO_PI;

          let sweep: IntermediateTree.Sweep["sweep"];
          if (rot > Math.PI) sweep = "CW";
          else sweep = "CCW";

          path = { sweep: sweep, radius: radius };
        } else {
          path = { sweep: undefined };
        }

        tree.connections.push({
          a: nodeId,
          b: outNodeId,
          path: path,
        });
      }
    }
  }

  const ASCENDANCY_POS_X = 7000;
  const ASCENDANCY_POS_Y = -7700;
  for (const [, asc] of Object.entries(tree.ascendancies)) {
    const startNode = tree.nodes[asc.startNodeId];

    const diff_x = ASCENDANCY_POS_X - startNode.position.x;
    const diff_y = ASCENDANCY_POS_Y - startNode.position.y;

    const updateNode = (node: IntermediateTree.Node) => {
      node.position.x += diff_x;
      node.position.y += diff_y;
    };

    for (const nodeId of asc.nodeIds) {
      const node = tree.nodes[nodeId];

      updateNode(node);
      updateMinxMax(node.position.x, node.position.y);
    }
  }

  return tree;
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
    a.ascendancyName === b.ascendancyName
  );
}

function buildNode(
  id: string,
  pos: IntermediateTree.Coord,
  node: SkillTree.Node
): IntermediateTree.Node {
  if (node.ascendancyName !== undefined) {
    let ascendancyKind: IntermediateTree.AscendancyNode["ascendancyKind"];
    if (node.isAscendancyStart) ascendancyKind = "Start";
    else if (node.isNotable) ascendancyKind = "Notable";
    else ascendancyKind = "Normal";

    return {
      position: pos,
      kind: "Ascendancy",
      ascendancyName: node.ascendancyName,
      ascendancyKind: ascendancyKind,
    };
  }

  if (node.isMastery) {
    return {
      position: pos,
      kind: "Mastery",
    };
  }

  if (node.isKeystone) {
    return {
      position: pos,
      kind: "Keystone",
    };
  }

  if (node.isNotable) {
    return {
      position: pos,
      kind: "Notable",
    };
  }

  return {
    position: pos,
    kind: "Normal",
  };
}
