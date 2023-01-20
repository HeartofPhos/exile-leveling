import classNames from "classnames";
import { useState } from "react";
import { BuildData } from "../../../../common/route-processing";
import { formStyles } from "../Form";
import { processPob } from "./pob";

import styles from "./BuildImportForm.module.css";

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
  onReset: () => void;
}

type UrlImporter = (url: string) => string | null;

function getPobCodeUrl(pobCodeOrUrl: string) {
  for (const urlImporter of urlImporters) {
    const downloadUrl = urlImporter(pobCodeOrUrl);
    if (downloadUrl) return downloadUrl;
  }

  return null;
}

const urlImporters: UrlImporter[] = [
  (url) => {
    const match = /pastebin\.com\/(.+)$/.exec(url);
    if (!match) return null;

    return `pastebin.com/raw/${match[1]}`;
  },
  (url) => {
    const match = /poe\.ninja\/pob\/(.+)$/.exec(url);
    if (!match) return null;

    return `poe.ninja/pob/raw/${match[1]}`;
  },
  (url) => {
    const match = /pobb\.in\/(.+)$/.exec(url);
    if (!match) return null;

    return `pobb.in/pob/${match[1]}`;
  },
  (url) => {
    const match = /youtube.com\/redirect\?.+?q=(.+?)(?:&|$)/.exec(url);
    if (!match) return null;
    const redirectUrl = decodeURIComponent(match[1]);

    return getPobCodeUrl(redirectUrl);
  },
];

export function BuildImportForm({ onSubmit, onReset }: BuildFormProps) {
  const [pobCodeOrUrl, setPobCodeOrUrl] = useState<string>();

  return (
    <div className={classNames(formStyles.form)}>
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
          onClick={() => {
            onReset();
            setPobCodeOrUrl("");
          }}
        >
          Reset Build
        </button>
        <button
          className={classNames(formStyles.formButton)}
          onClick={async () => {
            if (!pobCodeOrUrl) return;

            let pobCode = pobCodeOrUrl;
            const downloadUrl = getPobCodeUrl(pobCodeOrUrl);
            if (downloadUrl) {
              try {
                pobCode = await fetch(
                  `https://phos-cors-proxy.azurewebsites.net/${downloadUrl}`
                ).then((x) => x.text());
              } catch {
                console.log(`Failed to download: ${downloadUrl}`);
              }
            }

            const buildData = processPob(pobCode);
            if (buildData) onSubmit(buildData);
            setPobCodeOrUrl("");
          }}
        >
          Import Build
        </button>
      </div>
    </div>
  );
}
