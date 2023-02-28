import { PassiveTree } from "../../../../common/data/tree";
import { globImportLazy } from "../../utility";
import { ViewBox, buildTemplate } from "./svg";
import Handlebars from "handlebars";

export const TREE_DATA_LOOKUP = globImportLazy<
  [PassiveTree.Data, string, ViewBox, Handlebars.TemplateDelegate]
>(
  import.meta.glob("../../../../common/data/tree/*.json"),
  (key) => /.*\/(.*?).json$/.exec(key)![1],
  (value) => {
    const passiveTree: PassiveTree.Data = value.default;
    const { svg, viewBox, styleTemplate } = buildTemplate(passiveTree);
    const styleCompiled = Handlebars.compile(styleTemplate);
    return [passiveTree, svg, viewBox, styleCompiled];
  }
);
