import { BuildInfoForm, GemOrderList } from "../../components/BuildEditForm";
import { BuildImportForm } from "../../components/BuildImportForm";
import { formStyles } from "../../components/Form";
import { buildDataSelector } from "../../state/build-data";
import { requiredGemsSelector } from "../../state/gem";
import { searchStringsAtom } from "../../state/search-strings";
import { buildTreesSelector } from "../../state/tree/build-tree";
import { gemLinksSelector } from "../../state/gem-links";
import { withBlank } from "../../utility/withBlank";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import styles from "./styles.module.css";
import classNames from "classnames";
import { useRecoilState, useResetRecoilState } from "recoil";

function BuildContainer() {
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);
  const resetBuildData = useResetRecoilState(buildDataSelector);

  const [requiredGems, setRequiredGems] = useRecoilState(requiredGemsSelector);
  const resetRequiredGems = useResetRecoilState(requiredGemsSelector);

  const [buildTrees, setBuildTreesSelector] =
    useRecoilState(buildTreesSelector);
  const resetBuildTreesSelector = useResetRecoilState(buildTreesSelector);
  
  const [gemLinks, setGemLinks] = useRecoilState(gemLinksSelector);
  const resetGemLinks = useResetRecoilState(gemLinksSelector)

  return (
    <div>
      <BuildInfoForm
        buildData={buildData}
        onSubmit={(buildData) => {
          setBuildData(buildData);
        }}
      />
      <hr />
      <div className={classNames(formStyles.form)}>
        <EditSearchStrings />
        <BuildImportForm
          onSubmit={(pobData) => {
            setBuildData(pobData.buildData);
            setRequiredGems(pobData.requiredGems);
            setBuildTreesSelector(pobData.buildTrees);
            setGemLinks(pobData.gemLinks);
          }}
          onReset={() => {
            resetBuildData();
            resetRequiredGems();
            resetBuildTreesSelector();
            resetGemLinks();
          }}
        />
      </div>
      <hr />
      {requiredGems.length > 0 && (
        <>
          <GemOrderList
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

function EditSearchStrings() {
  const [searchStrings, setSearchStrings] = useRecoilState(searchStringsAtom);

  return (
    <div className={classNames(formStyles.formRow)}>
      <label>
        Search Strings {"("}
        <a href="https://poe.re/" target="_blank">
          Path of Exile Regex
        </a>
        {")"}
      </label>
      <textarea
        spellCheck={false}
        className={classNames(formStyles.formInput, styles.searchStringsInput)}
        value={searchStrings?.join("\n")}
        onChange={(e) => {
          if (e.target.value.length == 0) setSearchStrings(null);
          else
            setSearchStrings(
              e.target.value.split(/\r\n|\r|\n/).map((x) => x.trim())
            );
        }}
        aria-label="Search Strings"
      />
    </div>
  );
}

export default withBlank(withScrollRestoration(BuildContainer));
