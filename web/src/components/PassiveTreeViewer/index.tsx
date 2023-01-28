import Handlebars from "handlebars";
import { useEffect, useState } from "react";
import { globImportLazy } from "../../utility";
import { Viewport } from "../Viewport";
import { PassiveTree } from "../../../../common/data/tree";

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

function fromBinary(encoded: string) {
  const binary = window.atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Uint16Array(bytes.buffer);
}

function parseSkillTreeUrl(url: string, passiveTree: PassiveTree.Data) {
  const data = /.*\/(.*?)$/.exec(url)?.[1];
  if (!data) throw "invalid url";

  const unescaped = data.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Uint8Array.from(window.atob(unescaped), (c) =>
    c.charCodeAt(0)
  );

  const version =
    (buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3];
  const classId = buffer[4];
  const ascendancyId = buffer[5];

  let nodes;
  if (version == 4) {
    nodes = read_u16s(buffer, 7, (data.length - 7) / 2);
  } else if (version == 5 || version == 6) {
    nodes = read_u16s(buffer, 7, buffer[6]);
  } else throw "invalid version";

  return {
    class: passiveTree.classes[classId],
    ascendancy: passiveTree.classes[classId].ascendancies[ascendancyId - 1],
    nodes,
  };
}

function read_u16s(buffer: Uint8Array, offset: number, length: number) {
  if (buffer.length < offset + length * 2) throw "invalid u16 buffer";

  let result: number[] = [];
  for (let i = 0; i < length; i++) {
    const index = offset + i * 2;
    const value = (buffer[index] << 8) | buffer[index + 1];
    result.push(value);
  }

  return result;
}

const PASSIVE_TREE_URL =
  "https://www.pathofexile.com/passive-skill-tree/AAAABgYDfqlur7wGcCpNotnrMhhqAedfmLcwyBRnTpuGg_cb-hiRxkUPqxOamAat_DWS-wnw1WKsfVu4vmyMEZZfP3Up9UdtbO8OV9gmlUIszzIi4sLsSshZbVBChMUvbxmKpDmxHVUp2RNqjPVvE21w5xQgDki8ny7Q5liMNnp_UEd85ds0xKRJUVFMwzq1SNjDASSgeZUuFAmP-v1KGo8HHha_naqQDTboLiNvdz8nX7Aki3loMF5qNkfiWAf22hPfwQQ2Pep__Euw2BRNbzth4gNlbqrkUewYrEcb4CaIeA2TH3C7ykrYveKwtMV4L5u1ZKol39FvVUvAGrXyWK-kGQAL-wjrMt7yxkUgaq38hnS4vkW8dSkGv1Up9bFw52_e2MO6GgEk-30wXu6p0W8=";

export function PassiveTreeViewer() {
  const [svg, setSVG] = useState<string>();
  useEffect(() => {
    async function fn() {
      const version = "3.20";
      const compiled = await TREE_TEMPLATE_LOOKUP[version];
      const passiveTree = await TREE_DATA_LOOKUP[version];

      const parsed = parseSkillTreeUrl(PASSIVE_TREE_URL, passiveTree);

      const svg = compiled({
        backgroundColor: "#00000000",
        nodeColor: "#64748b",
        nodeActiveColor: "#38bdf8",
        connectionColor: "#64748b",
        connectionActiveColor: "#38bdf8",
        ascendancy: parsed.ascendancy.id,
        nodes: parsed.nodes,
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
