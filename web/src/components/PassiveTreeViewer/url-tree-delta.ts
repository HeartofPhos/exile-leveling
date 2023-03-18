import { PassiveTree } from "../../../../common/data/tree";
import { ViewBox } from "../../state/tree/svg";
import { UrlTree } from "../../state/tree/url-tree";

function intersection<T>(setA: Set<T>, setB: Set<T>) {
  const _intersection = new Set<T>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function difference<T>(setA: Set<T>, setB: Set<T>) {
  const _difference = new Set<T>(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export interface UrlTreeDelta {
  nodesActive: string[];
  nodesAdded: string[];
  nodesRemoved: string[];
  connectionsActive: string[];
  connectionsAdded: string[];
  connectionsRemoved: string[];
  masteryInfos: Record<string, MasteryInfo>;
}

export function buildUrlTreeDelta(
  currentTree: UrlTree.Data,
  previousTree: UrlTree.Data,
  passiveTree: PassiveTree.Data
): UrlTreeDelta {
  const nodesCurrent = new Set(currentTree.nodes);
  const nodesPrevious = new Set(previousTree.nodes);

  for (const [nodeId, effectId] of Object.entries(currentTree.masteryLookup)) {
    if (previousTree.masteryLookup[nodeId] !== effectId)
      nodesPrevious.delete(nodeId);
  }

  const nodesActive = intersection(nodesCurrent, nodesPrevious);
  const nodesAdded = difference(nodesCurrent, nodesPrevious);
  const nodesRemoved = difference(nodesPrevious, nodesCurrent);

  if (currentTree.ascendancy !== undefined)
    nodesActive.add(currentTree.ascendancy.startNodeId);

  const masteryInfos = buildMasteryInfos(
    currentTree,
    previousTree,
    passiveTree
  );

  const connections = buildConnections(
    nodesActive,
    nodesAdded,
    nodesRemoved,
    passiveTree
  );

  return {
    nodesActive: Array.from(nodesActive),
    nodesAdded: Array.from(nodesAdded),
    nodesRemoved: Array.from(nodesRemoved),
    ...connections,
    masteryInfos,
  };
}

export interface MasteryInfo {
  info: string;
}

function buildMasteryInfos(
  currentTree: UrlTree.Data,
  previousTree: UrlTree.Data,
  passiveTree: PassiveTree.Data
) {
  const masteryLookups = [
    previousTree.masteryLookup,
    currentTree.masteryLookup,
  ];

  const masteryInfos: UrlTreeDelta["masteryInfos"] = {};
  for (const masteryLookup of masteryLookups) {
    for (const [nodeId, effectId] of Object.entries(masteryLookup)) {
      masteryInfos[nodeId] = {
        info: passiveTree.masteryEffects[effectId].stats.join("\n"),
      };
    }
  }

  return masteryInfos;
}

function buildConnections(
  nodesActive: Set<string>,
  nodesAdded: Set<string>,
  nodesRemoved: Set<string>,
  passiveTree: PassiveTree.Data
) {
  const connectionsActive: string[] = [];
  const connectionsAdded: string[] = [];
  const connectionsRemoved: string[] = [];

  for (const graph of passiveTree.graphs) {
    for (const connection of graph.connections) {
      const id = `${connection.a}-${connection.b}`;

      const aIsActive = nodesActive.has(connection.a);
      const bIsActive = nodesActive.has(connection.b);

      if (aIsActive && bIsActive) connectionsActive.push(id);

      const aIsAdded = nodesAdded.has(connection.a);
      const bIsAdded = nodesAdded.has(connection.b);

      if (
        (aIsAdded && (bIsAdded || bIsActive)) ||
        (bIsAdded && (aIsAdded || aIsActive))
      )
        connectionsAdded.push(id);

      const aIsRemoved = nodesRemoved.has(connection.a);
      const bIsRemoved = nodesRemoved.has(connection.b);

      if (
        (aIsRemoved && (bIsRemoved || bIsActive)) ||
        (bIsRemoved && (aIsRemoved || aIsActive))
      )
        connectionsRemoved.push(id);
    }
  }

  return {
    connectionsActive,
    connectionsAdded,
    connectionsRemoved,
  };
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculateBounds(
  nodesActive: string[],
  nodesAdded: string[],
  nodesRemoved: string[],
  nodes: PassiveTree.NodeLookup,
  viewBox: ViewBox
): Bounds {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  const updateMinMax = (nodeId: string) => {
    const node = nodes[nodeId];

    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  };

  if (nodesAdded.length == 0 && nodesRemoved.length == 0) {
    for (const nodeId of nodesActive) {
      updateMinMax(nodeId);
    }
  } else {
    for (const nodeId of nodesAdded) {
      updateMinMax(nodeId);
    }

    for (const nodeId of nodesRemoved) {
      updateMinMax(nodeId);
    }
  }

  const padding = 1250;

  const x = minX - padding;
  const y = minY - padding;
  const w = maxX - minX + padding * 2;
  const h = maxY - minY + padding * 2;

  return {
    // Anchor 0,0
    x: x - viewBox.x,
    y: y - viewBox.y,
    width: w,
    height: h,
  };
}
