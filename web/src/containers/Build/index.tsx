import { BuildImportForm } from "../../components/BuildImportForm";
import { useRecoilState, useResetRecoilState } from "recoil";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import { buildDataSelector } from "../../state/build-data";
import { searchStringsAtom } from "../../state/search-strings";
import { BuildInfoForm, GemOrderList } from "../../components/BuildEditForm";
import { formStyles } from "../../components/Form";
import classNames from "classnames";
import styles from "./styles.module.css";
import { withBlank } from "../../utility/withBlank";

function BuildContainer() {
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);
  const resetBuildData = useResetRecoilState(buildDataSelector);

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
          onSubmit={(buildData) => {
            setBuildData(buildData);
          }}
          onReset={() => {
            resetBuildData();
          }}
        />
      </div>
      <hr />
      {buildData.requiredGems.length > 0 && (
        <>
          <GemOrderList
            requiredGems={buildData.requiredGems}
            onUpdate={(requiredGems) => {
              setBuildData({ ...buildData, requiredGems });
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
      />
    </div>
  );
}

export default withBlank(withScrollRestoration(BuildContainer));
