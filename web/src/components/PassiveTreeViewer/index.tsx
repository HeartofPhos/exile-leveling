import { useEffect, useState } from "react";
import { Viewport, ViewportProps } from "../Viewport";
import { PassiveTree } from "../../../../common/data/tree";
import { parseNodes as processNodes } from "./parse";
import { useRecoilValue } from "recoil";
import {
  TREE_DATA_LOOKUP,
  TREE_TEMPLATE_LOOKUP,
  UrlSkillTree,
  urlSkillTreesSelector,
} from "../../state/passive-trees";

export function PassiveTreeViewer() {
  const [curIndex, setCurIndex] = useState<number>(3);
  const [svg, setSVG] = useState<string>();
  const [viewBox, setViewBox] = useState<PassiveTree.ViewBox>();
  const [intialFocus, setIntialFocus] =
    useState<ViewportProps["intialFocus"]>();

  const { version, urlSkillTrees } = useRecoilValue(urlSkillTreesSelector);

  useEffect(() => {
    async function fn() {
      if (urlSkillTrees.length == 0) return;
      if (!version) return;

      const curTree = urlSkillTrees[curIndex];
      let prevTree: UrlSkillTree;
      if (curIndex != 0) prevTree = urlSkillTrees[curIndex - 1];
      else {
        prevTree = {
          class: curTree.class,
          ascendancy: curTree.ascendancy,
          nodes: [],
          masteries: [],
        };
        if (curTree.ascendancy)
          prevTree.nodes.push(curTree.nodes[curTree.nodes.length - 1]);
      }

      const compiled = await TREE_TEMPLATE_LOOKUP[version];
      const passiveTree = await TREE_DATA_LOOKUP[version];

      const {
        nodesActive,
        nodesAdded,
        nodesRemoved,
        connectionsActive,
        connectionsAdded,
        connectionsRemoved,
      } = processNodes(curTree.nodes, prevTree.nodes, passiveTree);

      let minX = Number.POSITIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
      const updateMinMax = (x: number, y: number) => {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      };

      if (nodesAdded.length == 0 && nodesRemoved.length == 0) {
        for (const nodeId of nodesActive) {
          const node = passiveTree.nodes[nodeId];
          updateMinMax(node.x, node.y);
        }
      } else {
        for (const nodeId of nodesAdded) {
          const node = passiveTree.nodes[nodeId];
          updateMinMax(node.x, node.y);
        }

        for (const nodeId of nodesRemoved) {
          const node = passiveTree.nodes[nodeId];
          updateMinMax(node.x, node.y);
        }
      }

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

        ascendancy: curTree.ascendancy?.id,
      });

      setSVG(window.btoa(svg));
      setViewBox(passiveTree.viewBox);
      setIntialFocus({
        offset: {
          x: (minX + maxX) * 0.5,
          y: (minY + maxY) * 0.5,
        },
        size: {
          x: maxX - minX + 2500,
          y: maxY - minY + 2500,
        },
      });
    }

    fn();
  }, [version, urlSkillTrees]);

  return (
    <>
      {intialFocus && viewBox && svg && (
        <Viewport viewBox={viewBox} intialFocus={intialFocus}>
          <img src={`data:image/svg+xml;base64,${svg}`} alt="" />
        </Viewport>
      )}
    </>
  );
}
