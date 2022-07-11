import { useEffect, useState } from "react";
import { ExileList } from "../../components/ExileList";
import { GemOrder } from "../../components/GemOrder";
import { BuildData } from "../../../../common/routes";

import { BuildForm } from "../../components/BuildForm";
import { clearPersistent, getPersistent, setPersistent } from "../../utility";

export function Build() {
  const [buildData, setBuildData] = useState<BuildData | null>(null);

  useEffect(() => {
    const fn = async () => {
      if (buildData) {
        setPersistent("build-data", buildData);
        clearPersistent("route-progress");
      } else {
        const buildData = getPersistent<BuildData>("build-data");
        if (buildData) setBuildData(buildData);
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
          clearPersistent("build-data");
          clearPersistent("route-progress");
          setBuildData(null);
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
