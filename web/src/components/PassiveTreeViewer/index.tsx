import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { globImportLazy } from "../../utility";
import { Viewport } from "../Viewport";

const TREE_TEMPLATE_LOOKUP = globImportLazy(
  import.meta.glob("../../../../common/data/tree-templates/*.svg"),
  (key) => /.*\/(.*?).svg$/.exec(key)![1],
  (value) =>
    fetch(new URL(value.default, import.meta.url).href)
      .then((res) => res.text())
      .then((template) => Handlebars.compile(template))
);

export function PassiveTreeViewer() {
  const [svg, setSVG] = useState<string>();
  useEffect(() => {
    async function fn() {
      const compiled = await TREE_TEMPLATE_LOOKUP["3.20"];

      const svg = compiled({
        backgroundColor: "#00000000",
        nodeColor: "#64748b",
        nodeStrokeWidth: 0,
        connectionColor: "#64748b",
        connectionStrokeWidth: 20,
        ascendancy: "Saboteur",
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
