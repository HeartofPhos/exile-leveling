import {
  atom,
  atomFamily,
  DefaultValue,
  useRecoilCallback,
  useRecoilState,
} from "recoil";
import { RecoilSync, syncEffect } from "recoil-sync";
import { routeFiles } from "../../../common/data";
import {
  BuildData,
  initializeRouteLookup,
  initializeRouteState,
  parseRoute,
} from "../../../common/routes";

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

function ExileSyncStore({ children }: SyncWithStorageProps) {
  const buildDataJson = localStorage.getItem("build-data");
  let buildData: BuildData | null = buildDataJson
    ? JSON.parse(buildDataJson)
    : null;

  const routeProgressJson = localStorage.getItem("route-progress");
  const routeProgress = new Set<string>(
    routeProgressJson ? JSON.parse(routeProgressJson) : undefined
  );

  const gemProgressJson = localStorage.getItem("gem-progress");
  const gemProgress = new Set<number>(
    gemProgressJson ? JSON.parse(gemProgressJson) : undefined
  );

  const resetGemProgress = useRecoilCallback(
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
                  localStorage.setItem("build-data", JSON.stringify(buildData));
                } else {
                  localStorage.removeItem("build-data");
                }

                resetGemProgress();
              }
              break;
            case "routeProgressAtomFamily":
              {
                const key = split[1];
                if (value) routeProgress.add(key);
                else routeProgress.delete(key);

                if (routeProgress.size > 0)
                  localStorage.setItem(
                    "route-progress",
                    JSON.stringify([...routeProgress])
                  );
                else localStorage.removeItem("route-progress");
              }
              break;
            case "gemProgressAtomFamily":
              {
                const key = Number.parseFloat(split[1]);
                if (value) gemProgress.add(key);
                else gemProgress.delete(key);

                if (gemProgress.size > 0)
                  localStorage.setItem(
                    "gem-progress",
                    JSON.stringify([...gemProgress])
                  );
                else localStorage.removeItem("gem-progress");
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
