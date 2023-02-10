import fetch from "cross-fetch";
import { PassiveTree } from "../../../common/data/tree";
import { buildTemplate as buildTemplateSVG } from "./svg";
import { buildIntermediateTree } from "./tree";
import { IntermediateTree, SkillTree } from "./types";

const PASSIVE_TREE_JSON = {
  "3_18":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/85c09648bbb9447474f84f48a942738ce3e5bdb4/data.json",
  "3_19":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/479be10a08d51c0a798cd693701a6bd6300738dc/data.json",
  "3_20":
    "https://raw.githubusercontent.com/grindinggear/skilltree-export/d2a0ffa5e15717e0115277f8bd852c6b53371429/data.json",
};

export async function buildTemplates() {
  const result = [];
  for (const [version, url] of Object.entries(PASSIVE_TREE_JSON)) {
    const skillTree: SkillTree.Data = await fetch(url).then((x) => x.json());

    const intermediateTree = buildIntermediateTree(skillTree);
    const { template, viewBox } = buildTemplateSVG(intermediateTree);

    const passiveTree: PassiveTree.Data = {
      classes: skillTree.classes.map((_class) => ({
        id: _class.name,
        ascendancies: _class.ascendancies.map((asc) => ({
          id: asc.id,
          startNodeId: intermediateTree.ascendancies[asc.id].startNodeId,
        })),
      })),
      nodes: {},
      connections: [],
      masteryEffects: intermediateTree.masteryEffects,
      viewBox: viewBox,
    };

    function pushNodes(nodes: Record<string, IntermediateTree.Node>) {
      for (const [nodeId, node] of Object.entries(nodes)) {
        passiveTree.nodes[nodeId] = node.position;
      }
    }

    function pushConnections(connections: IntermediateTree.Connection[]) {
      for (const connection of connections) {
        passiveTree.connections.push({
          a: connection.a,
          b: connection.b,
        });
      }
    }

    pushConnections(intermediateTree.connections);
    pushNodes(intermediateTree.nodes);

    for (const [, asc] of Object.entries(intermediateTree.ascendancies)) {
      pushNodes(asc.nodes);
      pushConnections(asc.connections);
    }

    result.push({
      version,
      template,
      passiveTree,
    });
  }

  return result;
}
