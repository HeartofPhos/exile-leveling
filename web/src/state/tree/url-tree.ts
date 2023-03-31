import { TREE_DATA_LOOKUP } from ".";
import { PassiveTree } from "../../../../common/data/tree";
import { RouteData } from "../../../../common/route-processing/types";
import { decodeBase64Url } from "../../utility";
import { buildTreesSelector } from "./build-tree";
import { selector } from "recoil";

export const urlTreesSelector = selector({
  key: "urlTreesSelector",
  get: async ({ get }) => {
    const buildTrees = get(buildTreesSelector);

    let urlTrees: UrlTree.Data[] = [];
    for (const buildTree of buildTrees) {
      try {
        const urlTree = await buildUrlTree(buildTree);
        if (urlTree.nodes.length === 0) continue;

        urlTrees.push(urlTree);
      } catch (e) {
        console.error(`could not process BuildTree, ${e}, ${buildTree.name}`);
      }
    }

    if (urlTrees.length > 0) {
      const version = urlTrees[0].version;
      urlTrees = urlTrees.filter((x) => x.version == version);
    }

    return { urlTrees };
  },
});

export namespace UrlTree {
  export interface Data {
    name: string;
    version: string;
    ascendancy?: PassiveTree.Ascendancy;
    nodes: string[];
    masteryLookup: Record<string, string>;
  }
}

export async function buildUrlTree(
  buildTree: RouteData.BuildTree
): Promise<UrlTree.Data> {
  const data = /.*\/(.*?)$/.exec(buildTree.url)?.[1];
  if (!data) throw `invalid url ${buildTree.url}`;

  const [passiveTree, nodeLookup] = await TREE_DATA_LOOKUP[buildTree.version];
  if (passiveTree === undefined) throw `invalid version ${buildTree.version}`;

  const buffer = decodeBase64Url(data);

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
    masteryCount = buffer[masteryOffset - 1] * 2;
  } else throw "invalid url version";

  // Filter nodes e.g. cluster jewels
  const nodes = read_u16s(buffer, nodesOffset, nodesCount)
    .map((x) => x.toString())
    .filter((x) => nodeLookup[x] !== undefined);

  const masteries: UrlTree.Data["masteryLookup"] = {};
  const masteryData = read_u16s(buffer, masteryOffset, masteryCount);
  for (let i = 0; i < masteryData.length; i += 2) {
    const nodeId = masteryData[i + 1].toString();
    const effectId = masteryData[i].toString();
    masteries[nodeId] = effectId;
  }

  return {
    name: buildTree.name,
    version: buildTree.version,
    ascendancy:
      ascendancyId > 0
        ? passiveTree.ascendancies[
            passiveTree.classes[classId].ascendancies[ascendancyId - 1]
          ]
        : undefined,
    nodes: nodes,
    masteryLookup: masteries,
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
