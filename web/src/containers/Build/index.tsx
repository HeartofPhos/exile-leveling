import { BuildImportForm } from "../../components/BuildImportForm";
import { useRecoilState } from "recoil";
import { withScrollRestoration } from "../../utility/withScrollRestoration";

import { buildDataSelector } from "../../utility/state/build-data-state";
import { BuildEditForm } from "../../components/BuildEditForm";
import { Form, formStyles } from "../../components/Form";
import classNames from "classnames";

import styles from "./Build.module.css";
import { searchStringsAtom } from "../../utility/state/search-strings";

function Build() {
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);
  const [searchStrings, setSearchStrings] = useRecoilState(searchStringsAtom);

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

      <Form>
        <div className={classNames(formStyles.formRow)}>
          <label>
            Search Strings {"("}
            <a href="https://poe.re/" target="_blank">
              poe.re
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
      </Form>
      <hr />
    </div>
  );
}

export default withScrollRestoration(Build);
