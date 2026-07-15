import { buildToggleState } from "./toggle-state";

const ROUTE_PROGRESS_VERSION = 0;
const [routeProgressFamily, clearRouteProgress] = buildToggleState(
  ROUTE_PROGRESS_VERSION,
  "route-progress",
);

export { routeProgressFamily, clearRouteProgress };
