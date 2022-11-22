import classNames from "classnames";
import { useState } from "react";
import { BuildData } from "../../../../common/route-processing";
import { Form, formStyles } from "../Form";
import { processPob } from "./pob";

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
}

export function BuildImportForm({ onSubmit }: BuildFormProps) {
  const [pobCode, setPobCode] = useState<string>();

  return (
    <Form>
      <div className={classNames(formStyles.formRow)}>
        <label>Path of Building Code</label>
        <div className={classNames(formStyles.formInput)}>
          <textarea
            spellCheck={false}
            className={classNames(formStyles.textarea)}
            value={pobCode || ""}
            onChange={(e) => setPobCode(e.target.value)}
          />
        </div>
      </div>
      <div className={classNames(formStyles.groupRight)}>
        <button
          className={classNames(formStyles.formButton)}
          onClick={() => {
            const buildData = processPob(pobCode);
            if (buildData) onSubmit(buildData);
          }}
        >
          Import
        </button>
      </div>
    </Form>
  );
}
