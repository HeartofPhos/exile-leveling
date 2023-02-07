import classNames from "classnames";
import { useEffect, useState } from "react";
import { BuildData } from "../../../../common/route-processing";
import { formStyles } from "../Form";
import { fetchPob, processPob } from "./pob";
import { toast } from "react-toastify";
import { TextModal } from "../Modal";

interface BuildFormProps {
  onSubmit: (buildData: BuildData) => void;
  onReset: () => void;
}

export function BuildImportForm({ onSubmit, onReset }: BuildFormProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={classNames(formStyles.form)}>
      <TextModal
        label="Path of Building Code"
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
