import classNames from "classnames";
import { useState } from "react";
import { BuildData } from "../../../../common/route-processing";
import { Form, formStyles } from "../Form";
import { processPob } from "./pob";

import styles from "./BuildImportForm.module.css";
import { useRecoilState } from "recoil";
import { buildDataSelector } from "../../utility/state/build-data-state";

export function BuildImportForm() {
  const [pobCode, setPobCode] = useState<string>();
  const [buildData, setBuildData] = useRecoilState(buildDataSelector);

  return (
    <Form>
      <div className={classNames(formStyles.formRow)}>
        <label>Path of Building Code</label>
        <textarea
          spellCheck={false}
          className={classNames(formStyles.formInput, styles.pobInput)}
          value={pobCode || ""}
          onChange={(e) => setPobCode(e.target.value)}
        />
      </div>
      <div className={classNames(formStyles.groupRight)}>
        <button
          className={classNames(formStyles.formButton)}
          onClick={() => {
            const buildData = processPob(pobCode);
            if (buildData) setBuildData(buildData);
          }}
        >
          Import
        </button>
      </div>
    </Form>
  );
}
