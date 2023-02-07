import Handlebars from "handlebars";
import { PassiveTree } from "../../../common/data/tree";
import { atom, DefaultValue, selector } from "recoil";
import { getPersistent, globImportLazy } from "../utility";
import { BuildTree } from "../../../common/route-processing";
import { persistentStorageEffect } from ".";

export const TREE_DATA_LOOKUP = globImportLazy<PassiveTree.Data>(
  import.meta.glob("../../../common/data/tree/*.json"),
  (key) => /.*\/(.*?).json$/.exec(key)![1],
  (value) => value.default
);

export const TREE_TEMPLATE_LOOKUP = globImportLazy(
  import.meta.glob("../../../common/data/tree/*.svg"),
  (key) => /.*\/(.*?).svg$/.exec(key)![1],
  (value) =>
    fetch(value.default)
      .then((res) => res.text())
      .then((template) => Handlebars.compile(template))
);

const BUILD_PASSIVE_TREES_VERSION = 0;

const buildTreesAtom = atom<BuildTree[] | null>({
  key: "buildTreesAtom",
  default: getPersistent("build-trees", BUILD_PASSIVE_TREES_VERSION),
  effects: [
    persistentStorageEffect("build-trees", BUILD_PASSIVE_TREES_VERSION),
  ],
});

export const buildTreesSelector = selector<BuildTree[]>({
  key: "buildTreesSelector",
  get: ({ get }) => {
    let value = get(buildTreesAtom);
    if (value === null) value = [];

    return value;
  },
  set: ({ set }, newValue) => {
    const value = newValue instanceof DefaultValue ? null : newValue;
    set(buildTreesAtom, value);
  },
});

export const urlTreesSelector = selector({
  key: "urlTreesSelector",
  get: async ({ get }) => {
    const buildPassiveTrees = get(buildTreesSelector);

    let urlTrees: UrlTree.Data[] = [];
    for (const buildTree of buildPassiveTrees) {
      try {
        const urlTree = await buildUrlTree(buildTree);

        const hasNodes =
          urlTree.ascendancy === undefined
            ? urlTree.nodes.length > 0
            : urlTree.nodes.length > 1;
        if (!hasNodes) continue;

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
    class: PassiveTree.Class;
    ascendancy?: PassiveTree.Ascendancy;
    nodes: string[];
    masteryLookup: Record<string, string>;
  }
}

export async function buildUrlTree(
  buildTree: BuildTree
): Promise<UrlTree.Data> {
  const data = /.*\/(.*?)$/.exec(buildTree.url)?.[1];
  if (!data) throw `invalid url ${buildTree.url}`;

  const passiveTree = await TREE_DATA_LOOKUP[buildTree.version];
  const template = await TREE_TEMPLATE_LOOKUP[buildTree.version];

  if (passiveTree === undefined || template === undefined)
    throw `invalid version ${buildTree.version}`;

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
    masteryCount = buffer[masteryOffset - 1] * 2;
  } else throw "invalid url version";

  // Filter nodes e.g. cluster jewels
  const nodes = read_u16s(buffer, nodesOffset, nodesCount)
    .map((x) => x.toString())
    .filter((x) => passiveTree.nodes[x] !== undefined);

  const masteries: UrlTree.Data["masteryLookup"] = {};
  const masteryData = read_u16s(buffer, masteryOffset, masteryCount);
  for (let i = 0; i < masteryData.length; i += 2) {
    const nodeId = masteryData[i + 1].toString();
    const effectId = masteryData[i].toString();
    masteries[nodeId] = effectId;
  }

  let ascendancy;
  if (ascendancyId > 0) {
    ascendancy = passiveTree.classes[classId].ascendancies[ascendancyId - 1];
    nodes.push(ascendancy.startNodeId);
  }

  return {
    name: buildTree.name,
    version: buildTree.version,
    class: passiveTree.classes[classId],
    ascendancy:
      ascendancyId > 0
        ? passiveTree.classes[classId].ascendancies[ascendancyId - 1]
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
