import { BuildImportForm } from "../../components/BuildImportForm";
import { useRecoilState, useResetRecoilState } from "recoil";
import { withScrollRestoration } from "../../utility/withScrollRestoration";
import { buildDataSelector } from "../../state/build-data";
import { searchStringsAtom } from "../../state/search-strings";
import { BuildInfoForm, GemOrderList } from "../../components/BuildEditForm";
import { formStyles } from "../../components/Form";
import classNames from "classnames";
import styles from "./styles.module.css";

function BuildContainer() {
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);
  const resetBuildData = useResetRecoilState(buildDataSelector);
  const [searchStrings, setSearchStrings] = useRecoilState(searchStringsAtom);

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
            className={classNames(
              formStyles.formInput,
              styles.searchStringsInput
            )}
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
      </div>
      <BuildImportForm
        onSubmit={(buildData) => {
          setBuildData(buildData);
        }}
        onReset={() => {
          resetBuildData();
        }}
      />
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

export default withScrollRestoration(BuildContainer);
