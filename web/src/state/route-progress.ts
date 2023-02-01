import { atomFamily, selectorFamily, useRecoilCallback } from "recoil";
import { clearPersistent, getPersistent, setPersistent } from "../utility";

const ROUTE_PROGRESS_VERSION = 0;

const routeProgress = new Set<string>(
  getPersistent<string[]>("route-progress", ROUTE_PROGRESS_VERSION)
);

const routeProgressAtomFamily = atomFamily<boolean, string>({
  key: "routeProgressAtomFamily",
  default: (param) => routeProgress.has(param),
});

export const routeProgressSelectorFamily = selectorFamily<boolean, string>({
  key: "routeProgressSelectorFamily",
  get:
    (param) =>
    ({ get }) => {
      const routeProgressAtom = get(routeProgressAtomFamily(param));
      return routeProgressAtom;
    },
  set:
    (param) =>
    ({ set }, newValue) => {
      set(routeProgressAtomFamily(param), newValue);

      if (newValue) routeProgress.add(param);
      else routeProgress.delete(param);

      if (routeProgress.size > 0)
        setPersistent("route-progress", ROUTE_PROGRESS_VERSION, [
          ...routeProgress,
        ]);
      else clearPersistent("route-progress");
    },
});

export const routeProgressKeys = () => routeProgress.keys();

export function useClearRouteProgress() {
  return useRecoilCallback(
    ({ set }) =>
      () => {
        for (const key of routeProgress.keys()) {
          set(routeProgressSelectorFamily(key), false);
        }
      },
    []
  );
}
