import classNames from "classnames";
import { useEffect, useState } from "react";
import { BuildData } from "../../../../common/route-processing";
import { formStyles } from "../Form";
import { fetchPob, processPob } from "./pob";
import { toast } from "react-toastify";

import styles from "./styles.module.css";
import { ExileModal } from "../ExileModal";

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
  onReset: () => void;
}

export function BuildImportForm({ onSubmit, onReset }: BuildFormProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={classNames(formStyles.form)}>
      <BuildImportModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onSubmit={(pobCodeOrUrl) =>
          toast.promise(
            async () => {
              if (!pobCodeOrUrl) return Promise.reject("invalid pobCodeOrUrl");
              const pobCode = await fetchPob(pobCodeOrUrl);

              const buildData = processPob(pobCode);
              if (!buildData) return Promise.reject("parsing failed");

              onSubmit(buildData);
            },
            {
              pending: "Importing Build",
              success: "Import Success",
              error: "Import Failed",
            }
          )
        }
      />
      <div className={classNames(formStyles.groupRight)}>
        <button
          className={classNames(formStyles.formButton)}
          onClick={() => {
            onReset();
          }}
        >
          Reset Build
        </button>
        <button
          className={classNames(formStyles.formButton)}
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Import Build
        </button>
      </div>
    </div>
  );
}

interface BuildImportModalProps {
  isOpen: boolean;
  onSubmit: (pobCodeOrUrl: string | undefined) => void;
  onRequestClose: () => void;
}

function BuildImportModal({
  isOpen,
  onSubmit,
  onRequestClose,
}: BuildImportModalProps) {
  const [pobCodeOrUrl, setPobCodeOrUrl] = useState<string>();

  useEffect(() => {
    if (!isOpen) setPobCodeOrUrl("");
  }, [isOpen]);

  return (
    <ExileModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={classNames(formStyles.form, styles.grow)}>
        <div className={classNames(formStyles.formRow, styles.grow)}>
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
              onRequestClose();
            }}
          >
            Cancel
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onRequestClose();
              onSubmit(pobCodeOrUrl);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </ExileModal>
  );
}
