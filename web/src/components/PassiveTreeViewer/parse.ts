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

  const nodeSet = new Set(nodes.map((x) => x.toString()));

  let ascendancy;
  if (ascendancyId > 0) {
    ascendancy = passiveTree.classes[classId].ascendancies[ascendancyId - 1];
    nodeSet.add(ascendancy.startNodeId);
  }

  return {
    class: passiveTree.classes[classId],
    ascendancy: ascendancy,
    nodes: nodes,
    connections: parseConnections(nodeSet, passiveTree),
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

function parseConnections(nodes: Set<string>, passiveTree: PassiveTree.Data) {
  const result = [];
  for (const connection of passiveTree.connections) {
    if (nodes.has(connection.a) && nodes.has(connection.b)) {
      const id = [connection.a, connection.b].sort().join("-");
      result.push(id);
    }
  }

  return result;
}
