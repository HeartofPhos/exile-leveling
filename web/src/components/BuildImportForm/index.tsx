import { formStyles } from "../Form";
import { TextModal } from "../Modal";
import { PobData, fetchPob, processPob } from "./pob";
import classNames from "classnames";
import { useState } from "react";
import { toast } from "react-toastify";

interface BuildImportFormProps {
  onSubmit: (pobData: PobData) => void;
  onReset: () => void;
}

export function BuildImportForm({ onSubmit, onReset }: BuildImportFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TextModal
        label="Path of Building Code"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onSubmit={(pobCodeOrUrl) =>
          toast.promise(
            async () => {
              if (!pobCodeOrUrl) return Promise.reject("invalid pobCodeOrUrl");
              const pobCode = await fetchPob(pobCodeOrUrl);

              const pobData = processPob(pobCode);
              if (!pobData) return Promise.reject("parsing failed");

              onSubmit(pobData);
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
            setIsOpen(true);
          }}
        >
          Import Build
        </button>
      </div>
    </>
  );
}
