import {
  buildRouteSource,
  getRouteFiles,
} from "../../../../common/route-processing";
import { RouteFile } from "../../../../common/route-processing/types";
import { formStyles } from "../Form";
import { TextModal } from "../Modal";
import styles from "./styles.module.css";
import { Workspace } from "./Workspace";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function cloneRouteFiles(routeFiles: RouteFile[]) {
  return routeFiles.map((x) => ({ ...x }));
}

interface RouteEditorProps {
  routeFiles: RouteFile[];
  onSubmit: (routeFiles: RouteFile[]) => void;
  onReset: () => void;
}

export function RouteEditor({
  routeFiles,
  onSubmit,
  onReset,
}: RouteEditorProps) {
  const [workingFiles, setWorkingFiles] = useState<RouteFile[]>([]);
  const [importIsOpen, setImportIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setWorkingFiles(cloneRouteFiles(routeFiles));
  }, [routeFiles]);

  const submitWorkingFiles = () => {
    onSubmit(getRouteFiles(workingFiles.map((x) => x.contents)));
  };

  useEffect(() => {
    const handler = (evt: KeyboardEvent) => {
      if ((evt.metaKey || evt.ctrlKey) && evt.key === "s") {
        evt.preventDefault();
        submitWorkingFiles();
      }
    };
    document.addEventListener("keydown", handler);

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [workingFiles]);

  return (
    <>
      <TextModal
        label="Import Route"
        isOpen={importIsOpen}
        onRequestClose={() => setImportIsOpen(false)}
        onSubmit={(routeSrc) =>
          toast.promise(
            async () => {
              const routeFiles = getRouteFiles([routeSrc || ""]);
              onSubmit(routeFiles);
            },
            {
              pending: "Importing Route",
              success: "Import Success",
              error: "Import Failed",
            }
          )
        }
      />
      <div className={classNames(formStyles.form, styles.editorForm)}>
        <Workspace
          workingFiles={workingFiles}
          isDirty={(workingFile, i) =>
            i < routeFiles.length &&
            routeFiles[i].contents !== workingFile.contents
          }
          onUpdate={setWorkingFiles}
        />
        <div className={classNames(formStyles.groupRight)}>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              const routeSource = buildRouteSource(workingFiles);
              navigator.clipboard.writeText(routeSource);
              toast.success("Exported to Clipboard");
            }}
          >
            Export
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              setImportIsOpen(true);
            }}
          >
            Import
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              setWorkingFiles(cloneRouteFiles(routeFiles));
              onReset();
            }}
          >
            Reset
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              submitWorkingFiles();
            }}
          >
            Save
          </button>
        </div>
      </div>
      <hr />
    </>
  );
}
