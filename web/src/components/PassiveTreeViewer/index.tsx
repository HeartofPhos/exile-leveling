import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { globImportLazy } from "../../utility";
import { Viewport, ViewportProps } from "../Viewport";
import { PassiveTree } from "../../../../common/data/tree";
import { parseNodes, parseSkillTreeUrl } from "./parse";

const TREE_TEMPLATE_LOOKUP = globImportLazy(
  import.meta.glob("../../../../common/data/tree/*.svg"),
  (key) => /.*\/(.*?).svg$/.exec(key)![1],
  (value) =>
    fetch(new URL(value.default, import.meta.url).href)
      .then((res) => res.text())
      .then((template) => Handlebars.compile(template))
);

const TREE_DATA_LOOKUP = globImportLazy<PassiveTree.Data>(
  import.meta.glob("../../../../common/data/tree/*.json"),
  (key) => /.*\/(.*?).json$/.exec(key)![1],
  (value) => value.default
);

const PASSIVE_TREE_URLS = [
  "https://www.pathofexile.com/passive-skill-tree/AAAABgQCAAAA",
  "https://www.pathofexile.com/passive-skill-tree/AAAABgQCAAAA",
  // "https://www.pathofexile.com/passive-skill-tree/AAAABgQAAZstAAA=",
  // "https://www.pathofexile.com/passive-skill-tree/AAAABgQAAZstAAA=",
  // "https://www.pathofexile.com/passive-skill-tree/AAAABgQACBm0Xzmwq8SCwo6K8Jst-KEAAA==",
  // "https://www.pathofexile.com/passive-skill-tree/AAAABgQACL6nXzmwq8SCmy2K8MKO-KEAAA==",
  // "https://www.pathofexile.com/passive-skill-tree/AAAABgMCfBzcfXXDeSpNHRT2rv6HjxqGs41973p671O7320s6YZ3hrcFLTWShs6nCErEfVsXL26q_rpMi_iTz4OYrYCkCwyjigqbtz6PT0rIuJO9NoLHEMy79lZI9qMCIHiuhO_jsJLBTZK1BBZvfIPub9i9tNPTftlgdO0j9qxH-IJ7IBKO2zS-p9rBFSADotgkM6_XcB5qMHxEnkGHLPEZtD8nPeL60lXWA4cMcy2DkoDfsEfiMF5eExEtjr5khL63j0akOTu6Emnjahcc_gq18pD63hdM_2Tn-ejvSzHCcXkXpGVyo_IGoGMFvXwo-vm9EzUA7kMxIuLr7mVNAAfPDYa3hnQLDEI213AYSCzxuhowXpBnYwVsRr18",
];

export function PassiveTreeViewer() {
  const [svg, setSVG] = useState<string>();
  const [passiveTree, setPassiveTree] = useState<PassiveTree.Data>();
  const [intialFocus, setIntialFocus] =
    useState<ViewportProps["intialFocus"]>();

  useEffect(() => {
    async function fn() {
      const version = "3.19";
      const compiled = await TREE_TEMPLATE_LOOKUP[version];
      const passiveTree = await TREE_DATA_LOOKUP[version];

      const curParsed = parseSkillTreeUrl(PASSIVE_TREE_URLS[1], passiveTree);
      const prevParsed = parseSkillTreeUrl(PASSIVE_TREE_URLS[0], passiveTree);

      const {
        nodesActive,
        nodesAdded,
        nodesRemoved,
        connectionsActive,
        connectionsAdded,
        connectionsRemoved,
      } = parseNodes(curParsed.nodes, prevParsed.nodes, passiveTree);

      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
      for (const nodeId of curParsed.nodes) {
        const node = passiveTree.nodes[nodeId];

        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x);
        maxY = Math.max(maxY, node.y);
      }

      for (const nodeId of prevParsed.nodes) {
        const node = passiveTree.nodes[nodeId];

        minX = Math.min(minX, node.x);
        minY = Math.min(minY, node.y);
        maxX = Math.max(maxX, node.x);
        maxY = Math.max(maxY, node.y);
      }

      setIntialFocus({
        offset: {
          x: (minX + maxX) * 0.5,
          y: (minY + maxY) * 0.5,
          // x: passiveTree.viewBox.x + passiveTree.viewBox.w / 2,
          // y: passiveTree.viewBox.y + passiveTree.viewBox.h / 2,
        },
        size: {
          // x: maxX - minX + 110,
          // y: maxY - minY + 110,
          x: passiveTree.viewBox.w * 1,
          y: passiveTree.viewBox.h * 1,
        },
      });

      const svg = compiled({
        backgroundColor: "#00000000",

        nodeColor: "#64748b",
        nodeActiveColor: "#38bdf8",
        nodeAddedColor: "#00ff00",
        nodeRemovedColor: "#ff0000",

        connectionColor: "#64748b",
        connectionActiveColor: "#38bdf8",
        connectionAddedColor: "#00ff00",
        connectionRemovedColor: "#ff0000",

        nodesActive,
        nodesAdded,
        nodesRemoved,

        connectionsActive,
        connectionsAdded,
        connectionsRemoved,

        ascendancy: curParsed.ascendancy?.id,
      });

      setSVG(window.btoa(svg));
      setPassiveTree(passiveTree);
    }

    fn();
  }, []);

  return (
    <>
      {intialFocus && passiveTree && svg && (
        <Viewport viewBox={passiveTree.viewBox} intialFocus={intialFocus}>
          <img src={`data:image/svg+xml;base64,${svg}`} alt="" />
        </Viewport>
      )}
    </>
  );
}
