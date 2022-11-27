import classNames from "classnames";
import { useState } from "react";
import { BuildData } from "../../../../common/route-processing";
import { Form, formStyles } from "../Form";
import { processPob } from "./pob";

import styles from "./BuildImportForm.module.css";

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
}

type UrlImporter = (url: string) => string | null;

const urlImporters: UrlImporter[] = [
  (url) => {
    const match = /pastebin\.com\/(\w+)\s*$/.exec(url);
    if (!match) return null;

    return `https://pastebin.com/raw/${match[1]}`;
  },
  (url) => {
    const match = /poe\.ninja\/pob\/(\w+)/.exec(url);
    if (!match) return null;

    return `https://poe.ninja/pob/raw/${match[1]}`;
  },
  (url) => {
    const match = /pobb\.in\/(\w+)/.exec(url);
    if (!match) return null;

    return `https://pobb.in/pob/${match[1]}`;
  },
];

export function BuildImportForm({ onSubmit }: BuildFormProps) {
  const [pobCodeOrUrl, setPobCodeOrUrl] = useState<string>();

  return (
    <Form>
      <div className={classNames(formStyles.formRow)}>
        <label>Path of Building Code</label>
        <textarea
          spellCheck={false}
          className={classNames(formStyles.formInput, styles.pobInput)}
          value={pobCodeOrUrl || ""}
          onChange={(e) => setPobCodeOrUrl(e.target.value)}
        />
      </div>
      <div className={classNames(formStyles.groupRight)}>
        <button
          className={classNames(formStyles.formButton)}
          onClick={async () => {
            if (!pobCodeOrUrl) return;

            let pobCode = pobCodeOrUrl;
            for (const urlImporter of urlImporters) {
              const downloadUrl = urlImporter(pobCodeOrUrl);
              console.log(downloadUrl);
              if (downloadUrl) {
                pobCode = await fetch(
                  `https://api.allorigins.win/get?url=${encodeURIComponent(
                    downloadUrl
                  )}`
                )
                  .then((x) => x.json())
                  .then((x) => x.contents);
                break;
              }
            }
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
