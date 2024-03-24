import { SkillTree } from "../../../../common/data/tree";
import { TREE_DATA_LOOKUP } from "../../state/tree";
import { UrlTree } from "../../state/tree/url-tree";
import { formStyles } from "../../styles";
import { randomId } from "../../utility";
import { Viewport, ViewportProps } from "../Viewport";
import styles from "./styles.module.css";
import {
  UrlTreeDelta,
  buildUrlTreeDelta,
  calculateBounds,
} from "./url-tree-delta";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface SkillTreeViewerProps {
  urlTrees: UrlTree.Data[];
}

interface RenderData {
  svg: string;
  style: string;
  skillTree: SkillTree.Data;
  nodes: SkillTree.NodeLookup;
  intialFocus: ViewportProps["intialFocus"];
  masteries: UrlTreeDelta["masteries"];
}

export function SkillTreeViewer({ urlTrees }: SkillTreeViewerProps) {
  const svgDivRef = useRef<HTMLDivElement>(null);
  const [curIndex, setCurIndex] = useState<number>(0);
  const [renderData, setRenderData] = useState<RenderData>();
  const [styleId] = useState(() => randomId(6));
  const [tooltip, setTooltip] = useState<string | null>(null);

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
          masteries: {},
        };
      }

      const [skillTree, nodes, svg, viewBox, compiledStyle] =
        await TREE_DATA_LOOKUP[currentTree.version];

      const urlTreeDelta = buildUrlTreeDelta(
        currentTree,
        previousTree,
        skillTree
      );

      const bounds = calculateBounds(
        urlTreeDelta.nodesActive,
        urlTreeDelta.nodesAdded,
        urlTreeDelta.nodesRemoved,
        nodes,
        viewBox
      );

      const style = compiledStyle({
        styleId: styleId,
        backgroundColor: "#00000000",
        ascendancy: currentTree.ascendancy?.id,

        nodeColor: "hsl(215, 15%, 50%)",
        nodeActiveColor: "hsl(200, 80%, 50%)",
        nodeAddedColor: "hsl(120, 90%, 50%)",
        nodeRemovedColor: "hsl(0, 90%, 50%)",

        connectionColor: "hsl(215, 15%, 40%)",
        connectionActiveColor: "hsl(200, 80%, 40%)",
        connectionAddedColor: "hsl(120, 90%, 40%)",
        connectionRemovedColor: "hsl(0, 90%, 40%)",

        nodesActive: urlTreeDelta.nodesActive,
        nodesAdded: urlTreeDelta.nodesAdded,
        nodesRemoved: urlTreeDelta.nodesRemoved,

        connectionsActive: urlTreeDelta.connectionsActive,
        connectionsAdded: urlTreeDelta.connectionsAdded,
        connectionsRemoved: urlTreeDelta.connectionsRemoved,
      });

      setRenderData({
        svg,
        style,
        skillTree,
        nodes,
        intialFocus: bounds,
        masteries: urlTreeDelta.masteries,
      });
    }

    fn();
  }, [urlTrees, curIndex]);

  useEffect(() => {
    if (svgDivRef.current === null) return;
    if (renderData === undefined) return;

    for (const nodeId of Object.keys(renderData.nodes)) {
      const element = svgDivRef.current.querySelector<SVGTitleElement>(
        `#n${nodeId}`
      );
      if (element === null) continue;

      element.addEventListener("pointerenter", () => {
        setTooltip(nodeId);
      });

      element.addEventListener("pointerleave", () => {
        setTooltip(null);
      });
    }
  }, [svgDivRef, renderData]);

  return (
    <>
      {renderData && (
        <div className={classNames(styles.viewer)}>
          {tooltip && (
            <NodeTooltip
              skillTree={renderData.skillTree}
              nodes={renderData.nodes}
              masteries={renderData.masteries}
              nodeId={tooltip}
            />
          )}
          <div className={styles.viewport}>
            <Viewport
              intialFocus={renderData.intialFocus}
              resizeHandling="clip"
            >
              <style dangerouslySetInnerHTML={{ __html: renderData.style }} />
              <div
                id={styleId}
                ref={svgDivRef}
                dangerouslySetInnerHTML={{ __html: renderData.svg }}
              />
            </Viewport>
          </div>
          <label className={classNames(styles.label)}>
            {urlTrees.length > 0 && urlTrees[curIndex].name}
          </label>
          <div className={classNames(styles.buttons)}>
            <button
              className={classNames(formStyles.formButton, styles.button)}
              onClick={() => {
                if (curIndex > 0) setCurIndex(curIndex - 1);
              }}
            >
              <HiChevronLeft />
            </button>
            <button
              className={classNames(formStyles.formButton, styles.button)}
              onClick={() => {
                if (curIndex < urlTrees.length - 1) setCurIndex(curIndex + 1);
              }}
            >
              <HiChevronRight />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface NodeTooltipProps {
  skillTree: SkillTree.Data;
  nodes: SkillTree.NodeLookup;
  nodeId: keyof SkillTree.NodeLookup;
  masteries: Record<string, string>;
}
function NodeTooltip({
  skillTree,
  nodes,
  masteries,
  nodeId,
}: NodeTooltipProps) {
  const node = nodes[nodeId];

  let parts = [];

  if (node.stats && node.stats.length > 0) {
    parts.push(<pre>{node.stats.join("\n")}</pre>);
  }

  const masteryEffectId = masteries[nodeId];
  if (masteryEffectId) {
    const mastery = skillTree.masteryEffects[masteryEffectId];
    if (mastery.stats.length > 0) {
      parts.push(<pre>{mastery.stats.join("\n")}</pre>);
    }
  }

  return (
    <div className={classNames(styles.tooltip)}>
      <span className={classNames(styles.tooltipTitle)}>{node.text}</span>
      {parts.length > 0 && <hr />}
      {parts}
    </div>
  );
}
