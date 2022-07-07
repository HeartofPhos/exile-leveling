import { useEffect, useState } from "react";
import { ExileList } from "../../components/ExileList";
import { GemOrder } from "../../components/GemOrder";
import { BuildData } from "../../../../common/routes";

import { gems } from "../../../../common/data";
import { BuildForm } from "../../components/BuildForm";

export function Build() {
  const [buildData, setBuildData] = useState<BuildData>();

  useEffect(() => {
    const fn = async () => {
      if (buildData) {
        localStorage.setItem("build-data", JSON.stringify(buildData));
        localStorage.removeItem("route-progress");
      } else {
        const buildDataJson = localStorage.getItem("build-data");
        if (buildDataJson) setBuildData(JSON.parse(buildDataJson));
      }
    };

    fn();
  }, [buildData]);

  return (
    <div>
      <BuildForm
        onSubmit={(buildData) => {
          setBuildData(buildData);
        }}
        onReset={() => {
          localStorage.removeItem("build-data");
          localStorage.removeItem("route-progress");
          setBuildData(undefined);
        }}
      />
      <hr />
      {buildData && (
        <ExileList header={buildData.characterClass}>
          {buildData &&
            buildData.requiredGems.map((requiredGem, i) => (
              <GemOrder
                key={i}
                onMoveTop={() => {
                  const splice = buildData.requiredGems.splice(i, 1);
                  buildData.requiredGems.unshift(...splice);
                  setBuildData({
                    ...buildData,
                  });
                }}
                onMoveUp={() => {
                  if (i == 0) return;

                  const swap = buildData.requiredGems[i];
                  buildData.requiredGems[i] = buildData.requiredGems[i - 1];
                  buildData.requiredGems[i - 1] = swap;

                  setBuildData({
                    ...buildData,
                  });
                }}
                onMoveDown={() => {
                  if (i == buildData.requiredGems.length - 1) return;

                  const swap = buildData.requiredGems[i];
                  buildData.requiredGems[i] = buildData.requiredGems[i + 1];
                  buildData.requiredGems[i + 1] = swap;

                  setBuildData({
                    ...buildData,
                  });
                }}
                onDelete={() => {
                  buildData.requiredGems.splice(i, 1);
                  setBuildData({
                    ...buildData,
                  });
                }}
                requiredGem={requiredGem}
              />
            ))}
        </ExileList>
      )}
    </div>
  );
}
