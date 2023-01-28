import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { globImportLazy } from "../../utility";
import { Viewport } from "../Viewport";
import { PassiveTree } from "../../../../common/data/tree";
import { parseSkillTreeUrl } from "./parse";

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

const PASSIVE_TREE_URL =
  "https://www.pathofexile.com/passive-skill-tree/AAAABgYDfqlur7wGcCpNotnrMhhqAedfmLcwyBRnTpuGg_cb-hiRxkUPqxOamAat_DWS-wnw1WKsfVu4vmyMEZZfP3Up9UdtbO8OV9gmlUIszzIi4sLsSshZbVBChMUvbxmKpDmxHVUp2RNqjPVvE21w5xQgDki8ny7Q5liMNnp_UEd85ds0xKRJUVFMwzq1SNjDASSgeZUuFAmP-v1KGo8HHha_naqQDTboLiNvdz8nX7Aki3loMF5qNkfiWAf22hPfwQQ2Pep__Euw2BRNbzth4gNlbqrkUewYrEcb4CaIeA2TH3C7ykrYveKwtMV4L5u1ZKol39FvVUvAGrXyWK-kGQAL-wjrMt7yxkUgaq38hnS4vkW8dSkGv1Up9bFw52_e2MO6GgEk-30wXu6p0W8=";

export function PassiveTreeViewer() {
  const [svg, setSVG] = useState<string>();
  useEffect(() => {
    async function fn() {
      const version = "3.19";
      const compiled = await TREE_TEMPLATE_LOOKUP[version];
      const passiveTree = await TREE_DATA_LOOKUP[version];

      const parsed = parseSkillTreeUrl(PASSIVE_TREE_URL, passiveTree);

      const svg = compiled({
        backgroundColor: "#00000000",
        nodeColor: "#64748b",
        nodeActiveColor: "#38bdf8",
        connectionColor: "#64748b",
        connectionActiveColor: "#0ea5e9",
        ascendancy: parsed.ascendancy?.id,
        nodes: Array.from(parsed.nodes.values()),
        connections: parsed.connections,
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
