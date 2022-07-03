import pako from "pako";
import { useEffect, useState } from "react";
import { ExileList } from "../../components/ExileList";
import { GemOrder } from "../../components/GemOrder";
import { BuildData } from "../../../../common/routes";

import gems from "../../data/gems.json";
import { BuildForm } from "../../components/BuildForm";

function getGem(gemId: string) {
  return;
}

export function Gems() {
  const [buildData, setBuildData] = useState<BuildData>();

  useEffect(() => {
    const fn = async () => {
      if (buildData) {
        localStorage.setItem("build-data", JSON.stringify(buildData));
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
      />
      {buildData && (
        <ExileList
          header={buildData.characterClass}
          items={
            buildData &&
            buildData.requiredGems.map((x, i) => (
              <GemOrder
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
                gem={gems[x]}
              />
            ))
          }
        />
      )}
    </div>
  );
}
