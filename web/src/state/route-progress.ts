import { buildToggleState } from "./toggle-state";

const ROUTE_PROGRESS_VERSION = 0;
const [routeProgressFamily, routeProgressKeys, useClearRouteProgress] =
  buildToggleState(ROUTE_PROGRESS_VERSION, "route-progress");

export {
  routeProgressFamily,
  routeProgressKeys,
  useClearRouteProgress,
};
