import { BuildImportForm } from "../../components/BuildImportForm";
import { useRecoilState } from "recoil";
import { withScrollRestoration } from "../../utility/withScrollRestoration";

import { buildDataSelector } from "../../utility/state/build-data-state";
import { BuildEditForm } from "../../components/BuildEditForm";
import { Form, formStyles } from "../../components/Form";
import classNames from "classnames";

import styles from "./Build.module.css";
import { vendorStringsAtom } from "../../utility/state/vendor-strings";

function Build() {
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);

  const [vendorStrings, setVendorStringsAtom] =
    useRecoilState(vendorStringsAtom);

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
          <label>Vendor Search Strings</label>
          <textarea
            spellCheck={false}
            className={classNames(
              formStyles.formInput,
              styles.vendorStringsInput
            )}
            value={vendorStrings?.join("\n")}
            onChange={(e) => {
              if (e.target.value.length == 0) setVendorStringsAtom(null);
              else
                setVendorStringsAtom(
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
