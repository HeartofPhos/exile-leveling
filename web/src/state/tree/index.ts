import { SkillTree } from "../../../../common/data/tree";
import { globImportLazy } from "../../utility";
import { ViewBox, buildTemplate } from "./svg";
import Handlebars from "handlebars";

export const TREE_DATA_LOOKUP = globImportLazy<
  [
    SkillTree.Data,
    SkillTree.NodeLookup,
    string,
    ViewBox,
    Handlebars.TemplateDelegate
  ]
>(
  import.meta.glob("../../../../common/data/tree/*.json"),
  (key) => /.*\/(.*?).json$/.exec(key)![1],
  (value) => {
    const skillTree: SkillTree.Data = value.default;
    const nodeLookup: SkillTree.NodeLookup = Object.assign(
      {},
      ...skillTree.graphs.map((x) => x.nodes)
    );

    const { svg, viewBox, styleTemplate } = buildTemplate(
      skillTree,
      nodeLookup
    );
    const styleCompiled = Handlebars.compile(styleTemplate);

    return [skillTree, nodeLookup, svg, viewBox, styleCompiled];
  }
);
