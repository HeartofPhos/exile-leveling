import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { Viewport } from "../Viewport";

// @ts-expect-error
const TREE_TEMPLATE_LOOKUP: Record<string, string> = import.meta.glob(
  "../../../../common/data/tree-templates/*.svg"
);

export function PassiveTreeViewer() {
  const [svg, setSVG] = useState<string>();
  useEffect(() => {
    async function fn() {
      // @ts-expect-error
      const res = await TREE_TEMPLATE_LOOKUP[
        "../../../../common/data/tree-templates/3.20.svg"
      ]();

      const template = await fetch(
        new URL(res.default, import.meta.url).href
      ).then((x) => x.text());

      const compiled = Handlebars.compile(template);
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
