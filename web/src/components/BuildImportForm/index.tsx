import classNames from "classnames";
import { useState } from "react";
import { BuildData } from "../../../../common/route-processing";
import { Form, formStyles } from "../Form";
import { processPob } from "./pob";

import styles from "./BuildImportForm.module.css";

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
}

export function BuildImportForm({ onSubmit }: BuildFormProps) {
  const [pobCode, setPobCode] = useState<string>();

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
            if (buildData) onSubmit(buildData);
          }}
        >
          Import Build
        </button>
      </div>
    </Form>
  );
}
