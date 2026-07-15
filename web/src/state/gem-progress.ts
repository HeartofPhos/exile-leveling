import { buildToggleState } from "./toggle-state";

const GEM_PROGRESS_VERSION = 1;
const [gemProgressFamily, clearGemProgress] = buildToggleState(
  GEM_PROGRESS_VERSION,
  "gem-progress",
);

export { gemProgressFamily, clearGemProgress };
