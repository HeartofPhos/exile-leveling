import { buildToggleState } from "./toggle-state";

const GEM_PROGRESS_VERSION = 1;
const [gemProgressSelectorFamily, gemProgressKeys, useClearGemProgress] =
  buildToggleState(GEM_PROGRESS_VERSION, "gem-progress");

export { gemProgressSelectorFamily, gemProgressKeys, useClearGemProgress };
