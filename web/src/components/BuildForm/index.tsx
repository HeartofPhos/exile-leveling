import classNames from "classnames";
import { useState } from "react";
import { BuildData } from "../../../../common/routes";
import { Form, formStyles } from "../../components/Form";
import { processPob } from "./pob";

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
}

export function BuildForm({ onSubmit }: BuildFormProps) {
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
      <div className={classNames(formStyles.buttonRow)}>
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
