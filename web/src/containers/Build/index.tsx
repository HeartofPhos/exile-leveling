import { BuildImportForm } from "../../components/BuildImportForm";
import { useRecoilState } from "recoil";
import { withScrollRestoration } from "../../utility/withScrollRestoration";

import { buildDataSelector } from "../../utility/state/build-data-state";
import { BuildEditForm } from "../../components/BuildEditForm";

function Build() {
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);

  return (
    <div>
      {buildData ? (
        <BuildEditForm
          buildData={buildData}
          onSubmit={(buildData) => {
            setBuildData(buildData);
          }}
        />
      ) : (
        <BuildImportForm
          onSubmit={(buildData) => {
            setBuildData(buildData);
          }}
        />
      )}
      <hr />
    </div>
  );
}

export default withScrollRestoration(Build);
