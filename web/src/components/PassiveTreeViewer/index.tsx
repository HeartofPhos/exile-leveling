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
import styles from "./styles.module.css";
import classNames from "classnames";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { formStyles } from "../Form";

export function PassiveTreeViewer() {
  const [curIndex, setCurIndex] = useState<number>(0);
  const [svg, setSVG] = useState<string>();
  const [intialFocus, setIntialFocus] =
    useState<ViewportProps["intialFocus"]>();

  const { urlSkillTrees } = useRecoilValue(urlSkillTreesSelector);

  useEffect(() => {
    async function fn() {
      if (urlSkillTrees.length == 0) return;

      const curTree = urlSkillTrees[curIndex];
      let prevTree: UrlSkillTree;
      if (curIndex != 0) prevTree = urlSkillTrees[curIndex - 1];
      else {
        prevTree = {
          name: curTree.name,
          version: curTree.version,
          class: curTree.class,
          ascendancy: curTree.ascendancy,
          nodes: [],
          masteries: [],
        };
        if (curTree.ascendancy)
          prevTree.nodes.push(curTree.nodes[curTree.nodes.length - 1]);
      }

      const compiled = await TREE_TEMPLATE_LOOKUP[curTree.version];
      const passiveTree = await TREE_DATA_LOOKUP[curTree.version];

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
      setIntialFocus(() => (rect: DOMRect) => {
        const viewX = (minX + maxX) * 0.5;
        const viewY = (minY + maxY) * 0.5;
        const viewW = maxX - minX + 2500;
        const viewH = maxY - minY + 2500;

        // SVG copies width, preserveAspectRatio="xMidYMid"
        const divDim = rect.width;
        const viewDim = Math.max(passiveTree.viewBox.w, passiveTree.viewBox.h);

        const normalizedX = (viewX - passiveTree.viewBox.x) / viewDim;
        const normalizedY = (viewY - passiveTree.viewBox.y) / viewDim;

        const sizeX = divDim * (viewW / viewDim);
        const sizeY = divDim * (viewH / viewDim);

        return {
          offset: {
            x: divDim * normalizedX,
            y: divDim * normalizedY,
          },
          size: {
            x: sizeX,
            y: sizeY,
          },
        };
      });
    }

    fn();
  }, [urlSkillTrees, curIndex]);

  return (
    <>
      {intialFocus && svg && (
        <div className={classNames(styles.viewer)}>
          <Viewport intialFocus={intialFocus}>
            <img src={`data:image/svg+xml;base64,${svg}`} alt="" />
          </Viewport>
          <hr />
          <label className={classNames(styles.label)}>
            {urlSkillTrees.length > 0 && urlSkillTrees[curIndex].name}
          </label>
          <div className={classNames(styles.buttons)}>
            <HiChevronLeft
              className={classNames(formStyles.formButton, styles.button)}
              onClick={() => {
                if (curIndex > 0) setCurIndex(curIndex - 1);
              }}
            />
            <HiChevronRight
              className={classNames(formStyles.formButton, styles.button)}
              onClick={() => {
                if (curIndex < urlSkillTrees.length - 1)
                  setCurIndex(curIndex + 1);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
