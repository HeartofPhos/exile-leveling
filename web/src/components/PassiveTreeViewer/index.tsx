import { useEffect, useRef, useState } from "react";
import { Viewport, ViewportProps } from "../Viewport";
import { groupNodes, calculateBounds, buildMasteryInfos } from "./processs";
import {
  TREE_DATA_LOOKUP,
  TREE_TEMPLATE_LOOKUP,
  UrlTree,
} from "../../state/passive-trees";
import styles from "./styles.module.css";
import classNames from "classnames";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { formStyles } from "../Form";
import { randomId } from "../../utility";

interface PassiveTreeViewerProps {
  urlTrees: UrlTree.Data[];
}

interface RenderInfo {
  svg: string;
  intialFocus: ViewportProps["intialFocus"];
  masteryInfos: Record<string, string>;
}

export function PassiveTreeViewer({ urlTrees }: PassiveTreeViewerProps) {
  const svgDivRef = useRef<HTMLDivElement>(null);
  const [curIndex, setCurIndex] = useState<number>(0);
  const [renderInfo, setRenderInfo] = useState<RenderInfo>();

  useEffect(() => {
    async function fn() {
      if (urlTrees.length == 0) return;

      const curTree = urlTrees[curIndex];
      let prevTree: UrlTree.Data;
      if (curIndex != 0) prevTree = urlTrees[curIndex - 1];
      else {
        prevTree = {
          name: curTree.name,
          version: curTree.version,
          class: curTree.class,
          ascendancy: curTree.ascendancy,
          nodes: [],
          masteryLookup: {},
        };
        if (curTree.ascendancy)
          prevTree.nodes.push(curTree.nodes[curTree.nodes.length - 1]);
      }

      const compiled = await TREE_TEMPLATE_LOOKUP[curTree.version];
      const passiveTree = await TREE_DATA_LOOKUP[curTree.version];

      const groupedNodes = groupNodes(
        curTree.nodes,
        prevTree.nodes,
        passiveTree
      );

      const bounds = calculateBounds(groupedNodes, passiveTree);

      const svg = compiled({
        svgId: randomId(6),
        backgroundColor: "#00000000",
        ascendancy: curTree.ascendancy?.id,

        nodeColor: "#64748b",
        nodeActiveColor: "#38bdf8",
        nodeAddedColor: "#00ff00",
        nodeRemovedColor: "#ff0000",

        connectionColor: "#64748b",
        connectionActiveColor: "#38bdf8",
        connectionAddedColor: "#00ff00",
        connectionRemovedColor: "#ff0000",

        nodesActive: groupedNodes.nodesActive,
        nodesAdded: groupedNodes.nodesAdded,
        nodesRemoved: groupedNodes.nodesRemoved,

        connectionsActive: groupedNodes.connectionsActive,
        connectionsAdded: groupedNodes.connectionsAdded,
        connectionsRemoved: groupedNodes.connectionsRemoved,
      });

      const masteryInfos = buildMasteryInfos(passiveTree, [
        curTree.masteryLookup,
        prevTree.masteryLookup,
      ]);

      setRenderInfo({
        svg,
        intialFocus: bounds,
        masteryInfos,
      });
    }

    fn();
  }, [urlTrees, curIndex]);

  useEffect(() => {
    if (svgDivRef.current === null) return;
    if (renderInfo === undefined) return;

    for (const [nodeId, info] of Object.entries(renderInfo.masteryInfos)) {
      const node = svgDivRef.current.querySelector<SVGElement>(`#n${nodeId}`);
      if (node === null) return;

      const title = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "title"
      );
      title.textContent = info;

      node.appendChild(title);
    }
  }, [svgDivRef, renderInfo]);

  return (
    <>
      {renderInfo && (
        <div className={classNames(styles.viewer)}>
          <Viewport
            className={styles.viewport}
            intialFocus={renderInfo.intialFocus}
            resizePattern="clip"
          >
            <div
              ref={svgDivRef}
              dangerouslySetInnerHTML={{ __html: renderInfo.svg }}
            />
          </Viewport>
          <label className={classNames(styles.label)}>
            {urlTrees.length > 0 && (urlTrees[curIndex].name || "Default")}
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
                if (curIndex < urlTrees.length - 1) setCurIndex(curIndex + 1);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
