import { PassiveTree } from "../../../../common/data/tree";
import { globImportLazy } from "../../utility";
import { buildTemplate, ViewBox } from "./svg";
import Handlebars from "handlebars";

export const TREE_DATA_LOOKUP = globImportLazy<
  [PassiveTree.Data, Handlebars.TemplateDelegate, ViewBox]
>(
  import.meta.glob("../../../../common/data/tree/*.json"),
  (key) => /.*\/(.*?).json$/.exec(key)![1],
  (value) => {
    const passiveTree: PassiveTree.Data = value.default;
    const { template, viewBox } = buildTemplate(passiveTree);
    const compiled = Handlebars.compile(template);
    return [passiveTree, compiled, viewBox];
  }
);
