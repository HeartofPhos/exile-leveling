import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { globImportLazy } from "../../utility";
import { Viewport, ViewportProps } from "../Viewport";
import { PassiveTree } from "../../../../common/data/tree";
import { ParsedSkillTreeUrl, parseNodes, parseSkillTreeUrl } from "./parse";
import { selector, useRecoilValue } from "recoil";
import { buildDataSelector } from "../../state/build-data";
import { toast } from "react-toastify";

const parsedUrlsSelector = selector({
  key: "parsedUrlsSelector",
  get: async ({ get }) => {
    const buildData = get(buildDataSelector);

    let version;
    const parsedUrls = [];
    for (const buildTree of buildData.passiveTrees) {
      if (version === undefined) version = buildTree.version;
      else if (version !== buildTree.version) continue;

      const passiveTree = await TREE_DATA_LOOKUP[buildTree.version];
      try {
        const parsed = parseSkillTreeUrl(buildTree.url, passiveTree);

        const hasNodes =
          parsed.ascendancy === undefined
            ? parsed.nodes.length > 0
            : parsed.nodes.length > 1;
        if (!hasNodes) continue;

        parsedUrls.push(parsed);
      } catch (e) {
        toast.error(`Invalid Passive Tree, ${e}`);
      }
    }

    return { version, parsedUrls };
  },
});

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

export function PassiveTreeViewer() {
  const [curIndex, setCurIndex] = useState<number>(3);
  const [svg, setSVG] = useState<string>();
  const [viewBox, setViewBox] = useState<PassiveTree.ViewBox>();
  const [intialFocus, setIntialFocus] =
    useState<ViewportProps["intialFocus"]>();

  const { version, parsedUrls } = useRecoilValue(parsedUrlsSelector);

  useEffect(() => {
    async function fn() {
      if (!parsedUrls || parsedUrls.length == 0) return;
      if (!version) return;

      const curParsed = parsedUrls[curIndex];
      let prevParsed: ParsedSkillTreeUrl;
      if (curIndex != 0) prevParsed = parsedUrls[curIndex - 1];
      else {
        prevParsed = {
          class: curParsed.class,
          ascendancy: curParsed.ascendancy,
          nodes: [],
          masteries: [],
        };
        if (curParsed.ascendancy)
          prevParsed.nodes.push(curParsed.nodes[curParsed.nodes.length - 1]);
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
      } = parseNodes(curParsed.nodes, prevParsed.nodes, passiveTree);

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
      setViewBox(passiveTree.viewBox);
    }

    fn();
  }, [parsedUrls]);

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
