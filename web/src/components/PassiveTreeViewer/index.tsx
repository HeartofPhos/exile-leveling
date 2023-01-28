import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { globImportLazy } from "../../utility";
import { Viewport } from "../Viewport";
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
  "https://www.pathofexile.com/passive-skill-tree/AAAABgQACBm0Xzmwq8SCwo6K8Jst-KEAAA==",
  "https://www.pathofexile.com/passive-skill-tree/AAAABgQACL6nXzmwq8SCmy2K8MKO-KEAAA==",
];

export function PassiveTreeViewer() {
  const [svg, setSVG] = useState<string>();
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
    }

    fn();
  }, []);
  return (
    <Viewport>
      {svg && <img src={`data:image/svg+xml;base64,${svg}`} alt="" />}
    </Viewport>
  );
}
