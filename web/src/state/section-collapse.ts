import { buildToggleState } from "./toggle-state";

const SECTION_COLLAPSE_VERSION = 0;
const [
  sectionCollapseSelectorFamily,
  sectionCollapseKeys,
  useClearCollapseProgress,
] = buildToggleState(SECTION_COLLAPSE_VERSION, "section-collapse");

export {
  sectionCollapseSelectorFamily,
  sectionCollapseKeys,
  useClearCollapseProgress,
};
