import { PassiveTree } from "../../../../common/data/tree";
import { globImportLazy } from "../../utility";
import { ViewBox, buildTemplate } from "./svg";
import Handlebars from "handlebars";

export const TREE_DATA_LOOKUP = globImportLazy<
  [
    PassiveTree.Data,
    PassiveTree.NodeLookup,
    string,
    ViewBox,
    Handlebars.TemplateDelegate
  ]
>(
  import.meta.glob("../../../../common/data/tree/*.json"),
  (key) => /.*\/(.*?).json$/.exec(key)![1],
  (value) => {
    const passiveTree: PassiveTree.Data = value.default;
    const nodeLookup: PassiveTree.NodeLookup = Object.assign(
      {},
      ...passiveTree.graphs.map((x) => x.nodes)
    );

    const { svg, viewBox, styleTemplate } = buildTemplate(
      passiveTree,
      nodeLookup
    );
    const styleCompiled = Handlebars.compile(styleTemplate);

    return [passiveTree, nodeLookup, svg, viewBox, styleCompiled];
  }
);
