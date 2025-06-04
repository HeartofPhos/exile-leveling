import { buildToggleState } from "./toggle-state";

const ROUTE_PROGRESS_VERSION = 0;
const [routeProgressSelectorFamily, routeProgressKeys, useClearRouteProgress] =
  buildToggleState(ROUTE_PROGRESS_VERSION, "route-progress");

export {
  routeProgressSelectorFamily,
  routeProgressKeys,
  useClearRouteProgress,
};
