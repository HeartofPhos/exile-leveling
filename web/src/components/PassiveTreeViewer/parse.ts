import { PassiveTree } from "../../../../common/data/tree";

export interface ParsedSkillTreeUrl {
  class: PassiveTree.Class;
  ascendancy?: PassiveTree.Ascendancy;
  nodes: string[];
  masteries: string[];
}

export function parseSkillTreeUrl(
  url: string,
  passiveTree: PassiveTree.Data
): ParsedSkillTreeUrl {
  const data = /.*\/(.*?)$/.exec(url)?.[1];
  if (!data) throw "invalid url";

  const unescaped = data.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Uint8Array.from(window.atob(unescaped), (c) =>
    c.charCodeAt(0)
  );

  const version = read_u32(buffer, 0);
  const classId = buffer[4];
  const ascendancyId = buffer[5];

  let nodesOffset;
  let nodesCount;
  let clusterOffset;
  let clusterCount;
  let masteryOffset;
  let masteryCount;
  if (version >= 6) {
    nodesOffset = 7;
    nodesCount = buffer[6];
    clusterOffset = nodesOffset + nodesCount * 2 + 1;
    clusterCount = buffer[clusterOffset - 1];
    masteryOffset = clusterOffset + clusterCount * 2 + 1;
    masteryCount = buffer[masteryOffset - 1];
  } else throw "invalid version";

  const nodes = read_u16s(buffer, nodesOffset, nodesCount).map((x) =>
    x.toString()
  );
  const masteries = read_u16s(buffer, masteryOffset, masteryCount).map((x) =>
    x.toString()
  );

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
    masteries: masteries,
  };
}

function read_u16(buffer: Uint8Array, offset: number) {
  return (buffer[offset] << 8) | buffer[offset + 1];
}

function read_u32(buffer: Uint8Array, offset: number) {
  return (
    (buffer[offset] << 24) |
    (buffer[offset + 1] << 16) |
    (buffer[offset + 2] << 8) |
    buffer[offset + 3]
  );
}

function read_u16s(buffer: Uint8Array, offset: number, length: number) {
  if (buffer.length < offset + length * 2) throw "invalid u16 buffer";

  let result: number[] = [];
  for (let i = 0; i < length; i++) {
    const index = offset + i * 2;
    result.push(read_u16(buffer, index));
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
