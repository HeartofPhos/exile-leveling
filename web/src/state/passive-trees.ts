import Handlebars from "handlebars";
import { PassiveTree } from "../../../common/data/tree";
import { selector } from "recoil";
import { buildDataSelector } from "./build-data";
import { globImportLazy } from "../utility";
import { BuildPassiveTree } from "../../../common/route-processing";

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

export const urlSkillTreesSelector = selector({
  key: "urlSkillTreesSelector",
  get: async ({ get }) => {
    const buildData = get(buildDataSelector);

    const urlSkillTrees: UrlSkillTree.Data[] = [];
    for (const buildTree of buildData.passiveTrees) {
      try {
        const urlSkillTree = await buildUrlSkillTree(buildTree);

        const hasNodes =
          urlSkillTree.ascendancy === undefined
            ? urlSkillTree.nodes.length > 0
            : urlSkillTree.nodes.length > 1;
        if (!hasNodes) continue;

        urlSkillTrees.push(urlSkillTree);
      } catch (e) {
        console.error(
          `could not process UrlSkillTree, ${e}, ${buildTree.name}`
        );
      }
    }

    if (urlSkillTrees.length > 0) {
      const version = urlSkillTrees[0].version;
      return {
        urlSkillTrees: urlSkillTrees.filter((x) => x.version == version),
      };
    }

    return { urlSkillTrees };
  },
});

export namespace UrlSkillTree {
  export interface Data {
    name: string;
    version: string;
    class: PassiveTree.Class;
    ascendancy?: PassiveTree.Ascendancy;
    nodes: string[];
    masteries: Record<string, string>;
  }
}

export async function buildUrlSkillTree(
  buildTree: BuildPassiveTree
): Promise<UrlSkillTree.Data> {
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

  const nodes = read_u16s(buffer, nodesOffset, nodesCount).map((x) =>
    x.toString()
  );

  const masteries: UrlSkillTree.Data["masteries"] = {};
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
