import React from "react";
import { atom, atomFamily } from "recoil";
import { syncEffect } from "recoil-sync";
import { routeFiles } from "../../../common/data";
import {
  BuildData,
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
} from "../../../common/routes";

const checker = <T>(value: unknown) => {
  return {
    type: "success",
    value: value as T,
    warnings: [],
  };
};

const exileSyncEffect = syncEffect<any>({
  storeKey: "exile-sync-store",
  refine: checker,
});

const routeLookup = initializeRouteLookup();
export const routeDataAtom = atom({
  key: "routeDataAtom",
  default: {
    routeLookup: routeLookup,
    routes: parseRoute(routeFiles, routeLookup, initializeRouteState()),
  },
});

export const buildDataAtom = atom<BuildData | null>({
  key: "buildDataAtom",
  default: null,
  effects: [exileSyncEffect],
});

export const routeProgressAtomFamily = atomFamily<boolean, [number, number]>({
  key: "routeProgressAtomFamily", // unique ID (with respect to other atoms/selectors)
  default: (p) => false, // default value (aka initial value)
  effects: [exileSyncEffect],
});

export const gemProgressAtomFamily = atomFamily<boolean, number>({
  key: "gemProgressAtomFamily", // unique ID (with respect to other atoms/selectors)
  default: (p) => false, // default value (aka initial value)
  effects: [exileSyncEffect],
});
