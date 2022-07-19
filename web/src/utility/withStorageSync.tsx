import { DefaultValue, useRecoilState } from "recoil";
import { RecoilSync } from "recoil-sync";
import { gemProgressAtomFamily } from ".";
import { BuildData } from "../../../common/routes";

interface SyncWithStorageProps {
  children?: React.ReactNode;
}

export const ExileSyncStoreKey = "exile-sync-store";

export function ExileSyncStore({ children }: SyncWithStorageProps) {
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

                //TODO should reset gemProgressAtomFamily atoms
                gemProgress.clear();
                localStorage.removeItem("gem-progress");
              }
              break;
            case "routeProgressAtomFamily":
              {
                const key = split[1];
                if (value) routeProgress.add(key);
                else routeProgress.delete(key);

                localStorage.setItem(
                  "route-progress",
                  JSON.stringify([...routeProgress])
                );
              }
              break;
            case "gemProgressAtomFamily":
              {
                const key = Number.parseFloat(split[1]);
                if (value) gemProgress.add(key);
                else gemProgress.delete(key);

                localStorage.setItem(
                  "gem-progress",
                  JSON.stringify([...gemProgress])
                );
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
