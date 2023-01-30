import { PassiveTree } from "../../../../common/data/tree";

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

export function parseNodes(
  currentNodes: string[],
  prevNodes: string[],
  passiveTree: PassiveTree.Data
) {
  const curNodeSet = new Set(currentNodes);
  const prevNodeSet = new Set(prevNodes);

  const nodesActiveSet = intersection(curNodeSet, prevNodeSet);
  const nodesAddedSet = difference(curNodeSet, prevNodeSet);
  const nodesRemovedSet = difference(prevNodeSet, curNodeSet);

  const connectionsActive: string[] = [];
  const connectionsAdded: string[] = [];
  const connectionsRemoved: string[] = [];

  for (const connection of passiveTree.connections) {
    const id = [connection.a, connection.b].sort().join("-");

    const aIsActive = nodesActiveSet.has(connection.a);
    const bIsActive = nodesActiveSet.has(connection.b);

    if (aIsActive && bIsActive) connectionsActive.push(id);

    const aIsAdded = nodesAddedSet.has(connection.a);
    const bIsAdded = nodesAddedSet.has(connection.b);

    if (
      (aIsAdded && (bIsAdded || bIsActive)) ||
      (bIsAdded && (aIsAdded || aIsActive))
    )
      connectionsAdded.push(id);

    const aIsRemoved = nodesRemovedSet.has(connection.a);
    const bIsRemoved = nodesRemovedSet.has(connection.b);

    if (
      (aIsRemoved && (bIsRemoved || bIsActive)) ||
      (bIsRemoved && (aIsRemoved || aIsActive))
    )
      connectionsRemoved.push(id);
  }

  return {
    nodesActive: Array.from(nodesActiveSet),
    nodesAdded: Array.from(nodesAddedSet),
    nodesRemoved: Array.from(nodesRemovedSet),
    connectionsActive,
    connectionsAdded,
    connectionsRemoved,
  };
}
