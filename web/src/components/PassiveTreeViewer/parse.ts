import { PassiveTree } from "../../../../common/data/tree";

export function parseSkillTreeUrl(url: string, passiveTree: PassiveTree.Data) {
  const data = /.*\/(.*?)$/.exec(url)?.[1];
  if (!data) throw "invalid url";

  const unescaped = data.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Uint8Array.from(window.atob(unescaped), (c) =>
    c.charCodeAt(0)
  );

  const version =
    (buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3];
  const classId = buffer[4];
  const ascendancyId = buffer[5];

  let nodes;
  if (version == 4) {
    nodes = read_u16s(buffer, 7, (data.length - 7) / 2);
  } else if (version == 5 || version == 6) {
    nodes = read_u16s(buffer, 7, buffer[6]);
  } else throw "invalid version";

  nodes = nodes.map((x) => x.toString());

  let ascendancy;
  if (ascendancyId > 0) {
    ascendancy = passiveTree.classes[classId].ascendancies[ascendancyId - 1];
    nodes.push(ascendancy.startNodeId);
  }

  return {
    class: passiveTree.classes[classId],
    ascendancy:
      ascendancyId > 0
        ? passiveTree.classes[classId].ascendancies[ascendancyId - 1]
        : undefined,
    nodes: nodes,
  };
}

function read_u16s(buffer: Uint8Array, offset: number, length: number) {
  if (buffer.length < offset + length * 2) throw "invalid u16 buffer";

  let result: number[] = [];
  for (let i = 0; i < length; i++) {
    const index = offset + i * 2;
    const value = (buffer[index] << 8) | buffer[index + 1];
    result.push(value);
  }

  return result;
}

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
