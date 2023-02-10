import { PassiveTree } from "../../../../common/data/tree";
import { UrlTree } from "../../state/passive-trees";

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
  bounds: Bounds;
  masteryInfos: Record<string, MasteryInfo>;
}

export function buildUrlTreeDelta(
  currentTree: UrlTree.Data,
  previousTree: UrlTree.Data,
  passiveTree: PassiveTree.Data
): UrlTreeDelta {
  const nodesPrevious = new Set(currentTree.nodes);
  const nodesCurrent = new Set(previousTree.nodes);

  for (const [nodeId, effectId] of Object.entries(currentTree.masteryLookup)) {
    if (previousTree.masteryLookup[nodeId] !== effectId)
      nodesCurrent.delete(nodeId);
  }

  const nodesActiveSet = intersection(nodesPrevious, nodesCurrent);
  const nodesAddedSet = difference(nodesPrevious, nodesCurrent);
  const nodesRemovedSet = difference(nodesCurrent, nodesPrevious);

  const masteryInfos = buildMasteryInfos(
    currentTree,
    previousTree,
    passiveTree
  );

  const bounds = calculateBounds(
    nodesActiveSet,
    nodesAddedSet,
    nodesRemovedSet,
    passiveTree
  );

  if (currentTree.ascendancy !== undefined)
    nodesActiveSet.add(currentTree.ascendancy.startNodeId);

  const connections = buildConnections(
    nodesActiveSet,
    nodesAddedSet,
    nodesRemovedSet,
    passiveTree
  );

  return {
    nodesActive: Array.from(nodesActiveSet),
    nodesAdded: Array.from(nodesAddedSet),
    nodesRemoved: Array.from(nodesRemovedSet),
    ...connections,
    bounds,
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

  for (const connection of passiveTree.connections) {
    const id = [connection.a, connection.b].sort().join("-");

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

function calculateBounds(
  nodesActive: Set<string>,
  nodesAdded: Set<string>,
  nodesRemoved: Set<string>,
  passiveTree: PassiveTree.Data
): Bounds {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  const updateMinMax = (nodeId: string) => {
    const node = passiveTree.nodes[nodeId];

    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x);
    maxY = Math.max(maxY, node.y);
  };

  if (nodesAdded.size == 0 && nodesRemoved.size == 0) {
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
    x: x - passiveTree.viewBox.x,
    y: y - passiveTree.viewBox.y,
    width: w,
    height: h,
  };
}
