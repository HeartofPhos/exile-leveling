import { atom, atomFamily, DefaultValue, useRecoilCallback } from "recoil";
import { RecoilSync, syncEffect } from "recoil-sync";
import { clearPersistent, getPersistent, setPersistent } from ".";
import type { BuildData } from "../../../common/routes";

const ExileSyncStoreKey = "exile-sync-store";

function checker<T>(value: unknown) {
  return {
    type: "success",
    value: value as T,
    warnings: [],
  };
}

const exileSyncEffect = syncEffect<any>({
  storeKey: ExileSyncStoreKey,
  refine: checker,
});

async function initializeRouteData() {
  const { initializeRouteLookup, initializeRouteState, parseRoute } =
    await import("../../../common/routes");
  const { routeFiles } = await import("../../../common/data");
  const routeLookup = initializeRouteLookup();
  return {
    routeLookup: routeLookup,
    routes: parseRoute(routeFiles, routeLookup, initializeRouteState()),
  };
}

export const routeDataAtom = atom({
  key: "routeDataAtom",
  default: initializeRouteData(),
});

export const buildDataAtom = atom<BuildData | null>({
  key: "buildDataAtom",
  default: null,
  effects: [exileSyncEffect],
});

export const routeProgressAtomFamily = atomFamily<boolean, [number, number]>({
  key: "routeProgressAtomFamily",
  default: (p) => false,
  effects: [exileSyncEffect],
});

export const gemProgressAtomFamily = atomFamily<boolean, number>({
  key: "gemProgressAtomFamily",
  default: (p) => false,
  effects: [exileSyncEffect],
});

interface SyncWithStorageProps {
  children?: React.ReactNode;
}

let buildData: BuildData | null = getPersistent<BuildData>("build-data");

const routeProgress = new Set<string>(
  getPersistent<string[]>("route-progress")
);

const gemProgress = new Set<number>(getPersistent<number[]>("gem-progress"));

export function useClearRouteProgress() {
  return useRecoilCallback(
    ({ set }) =>
      async () => {
        for (const key of routeProgress.keys()) {
          set(routeProgressAtomFamily(JSON.parse(key)), false);
        }
      },
    []
  );
}

export function useClearGemProgress() {
  return useRecoilCallback(
    ({ set }) =>
      async () => {
        for (const key of gemProgress.keys()) {
          set(gemProgressAtomFamily(key), false);
        }
      },
    []
  );
}

function useResyncGemProgress() {
  return useRecoilCallback(
    ({ set }) =>
      async () => {
        for (const key of gemProgress.keys()) {
          const exists = buildData?.requiredGems.find((x) => x.uid == key)
            ? true
            : false;

          if (!exists) {
            gemProgress.delete(key);
            set(gemProgressAtomFamily(key), false);
          }
        }
      },
    []
  );
}

function ExileSyncStore({ children }: SyncWithStorageProps) {
  const resyncGemProgress = useResyncGemProgress();

  return (
    <RecoilSync
      storeKey={ExileSyncStoreKey}
      read={(itemKey) => {
        const split = itemKey.split("__");
        switch (split[0]) {
          case "buildDataAtom": {
            return buildData;
          }
          case "routeProgressAtomFamily": {
            const key = split[1];
            return routeProgress.has(key);
          }
          case "gemProgressAtomFamily": {
            const key = Number.parseFloat(split[1]);
            return gemProgress.has(key);
          }
        }

        return new DefaultValue();
      }}
      write={({ diff }) => {
        for (const [itemKey, value] of diff) {
          const split = itemKey.split("__");

          switch (split[0]) {
            case "buildDataAtom":
              {
                buildData = value as any;
                if (buildData) {
                  setPersistent("build-data", buildData);
                } else {
                  clearPersistent("build-data");
                }

                resyncGemProgress();
              }
              break;
            case "routeProgressAtomFamily":
              {
                const key = split[1];
                if (value) routeProgress.add(key);
                else routeProgress.delete(key);

                if (routeProgress.size > 0)
                  setPersistent("route-progress", [...routeProgress]);
                else clearPersistent("route-progress");
              }
              break;
            case "gemProgressAtomFamily":
              {
                const key = Number.parseFloat(split[1]);
                if (value) gemProgress.add(key);
                else gemProgress.delete(key);

                if (gemProgress.size > 0)
                  setPersistent("gem-progress", [...gemProgress]);
                else clearPersistent("gem-progress");
              }
              break;
          }
        }
      }}
    >
      {children}
    </RecoilSync>
  );
}

export default ExileSyncStore;
