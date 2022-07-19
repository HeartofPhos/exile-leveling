import { atom, atomFamily } from "recoil";
import { routeFiles } from "../../../common/data";
import {
  BuildData,
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
} from "../../../common/routes";

const routeLookup = initializeRouteLookup();
export const routeDataState = atom({
  key: "routeDataState",
  default: {
    routeLookup: routeLookup,
    routes: parseRoute(routeFiles, routeLookup, initializeRouteState()),
  },
});

export const buildDataState = atom<BuildData | null>({
  key: "buildDataState",
  default: null,
});

export const routeProgressState = atomFamily<boolean, [number, number]>({
  key: "routeProgressState", // unique ID (with respect to other atoms/selectors)
  default: (p) => false, // default value (aka initial value)
});

export const gemProgressState = atomFamily<boolean, number>({
  key: "gemProgressState", // unique ID (with respect to other atoms/selectors)
  default: (p) => false, // default value (aka initial value)
});
