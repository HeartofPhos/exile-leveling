import { useEffect, useRef, useState } from "react";
import { Viewport, ViewportProps } from "../Viewport";
import { buildUrlTreeDelta, UrlTreeDelta } from "./url-tree-delta";
import { PassiveTree } from "../../../../common/data/tree";
import { TREE_DATA_LOOKUP } from "../../state/tree";
import { UrlTree } from "../../state/tree/url-tree";
import classNames from "classnames";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { formStyles } from "../Form";
import { randomId } from "../../utility";
import styles from "./styles.module.css";

interface PassiveTreeViewerProps {
  urlTrees: UrlTree.Data[];
}

interface RenderData {
  id: string;
  svg: string;
  style: string;
  passiveTree: PassiveTree.Data;
  intialFocus: ViewportProps["intialFocus"];
  masteryInfos: UrlTreeDelta["masteryInfos"];
}

export function PassiveTreeViewer({ urlTrees }: PassiveTreeViewerProps) {
  const svgDivRef = useRef<HTMLDivElement>(null);
  const [curIndex, setCurIndex] = useState<number>(0);
  const [renderData, setRenderData] = useState<RenderData>();

  useEffect(() => {
    async function fn() {
      if (urlTrees.length == 0) return;

      const currentTree = urlTrees[curIndex];
      let previousTree: UrlTree.Data;
      if (curIndex != 0) previousTree = urlTrees[curIndex - 1];
      else {
        previousTree = {
          name: currentTree.name,
          version: currentTree.version,
          ascendancy: currentTree.ascendancy,
          nodes: [],
          masteryLookup: {},
        };
      }

      const [passiveTree, svg, viewBox, compiledStyle] = await TREE_DATA_LOOKUP[
        currentTree.version
      ];

      const urlTreeDelta = buildUrlTreeDelta(
        currentTree,
        previousTree,
        passiveTree,
        viewBox
      );

      const id = randomId(6);

      const style = compiledStyle({
        svgId: id,
        backgroundColor: "#00000000",
        ascendancy: currentTree.ascendancy?.name,

        nodeColor: "#64748b",
        nodeActiveColor: "#38bdf8",
        nodeAddedColor: "#00ff00",
        nodeRemovedColor: "#ff0000",

        connectionColor: "#64748b",
        connectionActiveColor: "#38bdf8",
        connectionAddedColor: "#00ff00",
        connectionRemovedColor: "#ff0000",

        nodesActive: urlTreeDelta.nodesActive,
        nodesAdded: urlTreeDelta.nodesAdded,
        nodesRemoved: urlTreeDelta.nodesRemoved,

        connectionsActive: urlTreeDelta.connectionsActive,
        connectionsAdded: urlTreeDelta.connectionsAdded,
        connectionsRemoved: urlTreeDelta.connectionsRemoved,
      });

      setRenderData({
        id,
        svg,
        style,
        passiveTree,
        intialFocus: urlTreeDelta.bounds,
        masteryInfos: urlTreeDelta.masteryInfos,
      });
    }

    fn();
  }, [urlTrees, curIndex]);

  useEffect(() => {
    if (svgDivRef.current === null) return;
    if (renderData === undefined) return;

    for (const [nodeId, masteryInfo] of Object.entries(
      renderData.masteryInfos
    )) {
      const title = svgDivRef.current.querySelector<SVGTitleElement>(
        `#n${nodeId} title`
      );
      if (title === null) return;

      title.textContent = `${renderData.passiveTree.nodes[nodeId].text}\n${masteryInfo.info}`;
    }
  }, [svgDivRef, renderData]);

  return (
    <>
      {renderData && (
        <div className={classNames(styles.viewer)}>
          <div className={styles.viewport}>
            <Viewport
              intialFocus={renderData.intialFocus}
              resizeHandling="clip"
            >
              <style
                dangerouslySetInnerHTML={{ __html: renderData.style }}
              ></style>
              <div
                id={renderData.id}
                ref={svgDivRef}
                dangerouslySetInnerHTML={{ __html: renderData.svg }}
              />
            </Viewport>
          </div>
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
