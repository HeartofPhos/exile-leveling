import { BuildImportForm } from "../../components/BuildImportForm";
import { BuildInfoForm } from "../../components/BuildInfoForm";
import { ConfigForm } from "../../components/ConfigForm";
import { GemEditForm } from "../../components/GemEditForm";
import { SearchStringsEditor } from "../../components/SearchStringsEditor";
import { buildDataSelector } from "../../state/build-data";
import { configSelector } from "../../state/config";
import { requiredGemsSelector } from "../../state/gem";
import { gemLinksSelector } from "../../state/gem-links";
import { pobCodeAtom } from "../../state/pob-code";
import { buildTreesSelector } from "../../state/tree/build-tree";
import { formStyles } from "../../styles";
import classNames from "classnames";
import { useRecoilState, useResetRecoilState } from "recoil";

export default function BuildContainer() {
  const [config, setConfig] = useRecoilState(configSelector);

  const [buildData, setBuildData] = useRecoilState(buildDataSelector);
  const resetBuildData = useResetRecoilState(buildDataSelector);

  const [requiredGems, setRequiredGems] = useRecoilState(requiredGemsSelector);
  const resetRequiredGems = useResetRecoilState(requiredGemsSelector);

  const [, setBuildTreesSelector] = useRecoilState(buildTreesSelector);
  const resetBuildTreesSelector = useResetRecoilState(buildTreesSelector);

  const [, setGemLinks] = useRecoilState(gemLinksSelector);
  const resetGemLinks = useResetRecoilState(gemLinksSelector);

  const [, setPobCode] = useRecoilState(pobCodeAtom);
  const resetPobCode = useResetRecoilState(pobCodeAtom);

  return (
    <div>
      <BuildInfoForm
        buildData={buildData}
        onSubmit={(buildData) => {
          setBuildData(buildData);
        }}
      />
      <hr />
      <ConfigForm
        config={config}
        onSubmit={(config) => {
          setConfig(config);
        }}
      />
      <hr />
      <div className={classNames(formStyles.form)}>
        <SearchStringsEditor />
        <BuildImportForm
          onSubmit={(pobData, pobCode) => {
            setBuildData(pobData.buildData);
            setRequiredGems(pobData.requiredGems);
            setBuildTreesSelector(pobData.buildTrees);
            setGemLinks(pobData.gemLinks);
            setPobCode(pobCode);
          }}
          onReset={() => {
            resetBuildData();
            resetRequiredGems();
            resetBuildTreesSelector();
            resetGemLinks();
            resetPobCode();
          }}
        />
      </div>
      <hr />
      {requiredGems.length > 0 && (
        <>
          <GemEditForm
            requiredGems={requiredGems}
            onUpdate={(requiredGems) => {
              setRequiredGems(requiredGems);
            }}
          />
          <hr />
        </>
      )}
    </div>
  );
}
