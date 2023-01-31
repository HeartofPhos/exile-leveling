import { useEffect, useRef, useState } from "react";
import { Viewport, ViewportProps } from "../Viewport";
import { groupNodes, calculateBounds } from "./processs";
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
  const objRef = useRef<HTMLObjectElement>(null);
  const [curIndex, setCurIndex] = useState<number>(0);
  const [svg, setSVG] = useState<string>();
  const [svgObjectURL, setSVGObjectURL] = useState<string>();
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

      const groupedNodes = groupNodes(
        curTree.nodes,
        prevTree.nodes,
        passiveTree
      );

      const bounds = calculateBounds(groupedNodes, passiveTree);

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

        nodesActive: groupedNodes.nodesActive,
        nodesAdded: groupedNodes.nodesAdded,
        nodesRemoved: groupedNodes.nodesRemoved,

        connectionsActive: groupedNodes.connectionsActive,
        connectionsAdded: groupedNodes.connectionsAdded,
        connectionsRemoved: groupedNodes.connectionsRemoved,

        ascendancy: curTree.ascendancy?.id,
      });

      setSVG(svg);
      setIntialFocus(bounds);
    }

    fn();
  }, [urlSkillTrees, curIndex]);

  useEffect(() => {
    if (svg === undefined) return;

    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    setSVGObjectURL(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [svg]);

  return (
    <>
      {intialFocus && svg && (
        <div className={classNames(styles.viewer)}>
          <Viewport intialFocus={intialFocus} resizePattern="clip">
            <object
              ref={objRef}
              style={{ pointerEvents: "none" }}
              onLoad={(evt) => {
                const doc = objRef.current!.contentDocument;
                console.log(doc);
              }}
              data={svgObjectURL}
            />
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
