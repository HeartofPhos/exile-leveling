import { PassiveTree } from "../../../common/data/tree/index";
import { SkillTree } from "./types";

const ANGLES_16: number[] = [
  0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330,
];
const ANGLES_40: number[] = [
  0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 110, 120, 130, 135, 140, 150,
  160, 170, 180, 190, 200, 210, 220, 225, 230, 240, 250, 260, 270, 280, 290,
  300, 310, 315, 320, 330, 340, 350,
];

// https://github.com/PathOfBuildingCommunity/PathOfBuilding/blob/e42c033ad0d1b46f714f902d00fd11fe9885afc2/fix_ascendancy_positions.py#L22
const ASCENDANCY_OFFSETS: Record<string, PassiveTree.Coord> = {
  ["Juggernaut"]: { x: -10400, y: 5200 },
  ["Berserker"]: { x: -10400, y: 3700 },
  ["Chieftain"]: { x: -10400, y: 2200 },
  ["Raider"]: { x: 10200, y: 5200 },
  ["Deadeye"]: { x: 10200, y: 2200 },
  ["Pathfinder"]: { x: 10200, y: 3700 },
  ["Occultist"]: { x: -1500, y: -9850 },
  ["Elementalist"]: { x: 0, y: -9850 },
  ["Necromancer"]: { x: 1500, y: -9850 },
  ["Slayer"]: { x: 1500, y: 9800 },
  ["Gladiator"]: { x: -1500, y: 9800 },
  ["Champion"]: { x: 0, y: 9800 },
  ["Inquisitor"]: { x: -10400, y: -2200 },
  ["Hierophant"]: { x: -10400, y: -3700 },
  ["Guardian"]: { x: -10400, y: -5200 },
  ["Assassin"]: { x: 10200, y: -5200 },
  ["Trickster"]: { x: 10200, y: -3700 },
  ["Saboteur"]: { x: 10200, y: -2200 },
  ["Ascendant"]: { x: -7800, y: 7200 },
};

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

export function buildPassiveTree(skillTree: SkillTree.Data) {
  const tree: PassiveTree.Data = {
    bounds: {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
    classes: skillTree.classes.map((_class) => ({
      id: _class.name,
      ascendancies: _class.ascendancies.map((asc) => asc.id),
    })),
    nodes: {},
    connections: [],
    ascendancies: {},
    masteryEffects: {},
  };

  for (const _class of skillTree.classes) {
    for (const ascendancy of _class.ascendancies) {
      // @ts-expect-error
      tree.ascendancies[ascendancy.name] = {
        nodes: {},
        connections: [],
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

      let nodes;
      let connections;
      if (node.ascendancyName !== undefined) {
        const asc = tree.ascendancies[node.ascendancyName!];
        if (node.isAscendancyStart) {
          asc.startNodeId = nodeId;
          asc.name = node.ascendancyName;
        }

        nodes = asc.nodes;
        connections = asc.connections;
      } else {
        updateMinxMax(x, y);
        nodes = tree.nodes;
        connections = tree.connections;
      }

      const treeNode = buildNode(node, { x, y });
      nodes[nodeId] = treeNode;

      if (node.out) {
        for (const outNodeId of node.out) {
          const outNode = skillTree.nodes[outNodeId];
          if (!filterConnection(node, outNode)) continue;

          let [outAngle] = getPosition(skillTree, outNode);

          let sweep: PassiveTree.Sweep | undefined;
          if (node.group === outNode.group && node.orbit === outNode.orbit) {
            const radius = skillTree.constants.orbitRadii[node.orbit!];
            const rotation = (angle - outAngle + TWO_PI) % TWO_PI;

            let winding: PassiveTree.Sweep["w"];
            if (rotation > Math.PI) winding = "CW";
            else winding = "CCW";

            sweep = { w: winding, r: radius };
          }

          connections.push({
            a: nodeId,
            b: outNodeId,
            s: sweep,
          });
        }
      }
    }
  }

  for (const [, asc] of Object.entries(tree.ascendancies)) {
    const startNode = asc.nodes[asc.startNodeId];

    const { x: ASCENDANCY_POS_X, y: ASCENDANCY_POS_Y } =
      ASCENDANCY_OFFSETS[asc.name];

    const diff_x = ASCENDANCY_POS_X - startNode.x;
    const diff_y = ASCENDANCY_POS_Y - startNode.y;

    const updateNode = (node: PassiveTree.Node) => {
      node.x += diff_x;
      node.y += diff_y;
    };

    for (const [, node] of Object.entries(asc.nodes)) {
      updateNode(node);
      updateMinxMax(node.x, node.y);
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
  node: SkillTree.Node,
  pos: PassiveTree.Coord
): PassiveTree.Node {
  if (node.isAscendancyStart)
    return {
      ...pos,
      k: "Ascendancy_Start",
    };

  if (node.isMastery)
    return {
      ...pos,
      k: "Mastery",
      text: node.name,
    };

  if (node.isKeystone)
    return {
      ...pos,
      k: "Keystone",
      text: node.stats?.join("\n"),
    };

  if (node.isNotable)
    return {
      ...pos,
      k: "Notable",
      text: node.stats?.join("\n"),
    };

  return {
    ...pos,
    k: "Normal",
    text: node.stats?.join("\n"),
  };
}
