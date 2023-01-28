import Handlebars from "handlebars";
import PLazy from "p-lazy";
import { useEffect, useState } from "react";
import { Viewport } from "../Viewport";

const TREE_TEMPLATE_LOOKUP = Object.entries(
  import.meta.glob("../../../../common/data/tree-templates/*.svg")
).reduce((prev, [key, value], i) => {
  const filename = /.*\/(.*?).svg$/.exec(key)![1];
  prev[filename] = new PLazy((resolve) =>
    value()
      .then((url) => fetch(new URL(url.default, import.meta.url).href))
      .then((res) => res.text())
      .then((template) => Handlebars.compile(template))
      .then((x) => resolve(x))
  );

  return prev;
}, {} as Record<string, PLazy<HandlebarsTemplateDelegate<any>>>);

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
