import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { formStyles } from "../../components/Form";
import { routeFilesSelector } from "../../state/route-files";
import Editor from "react-simple-code-editor";
import { highlight, Grammar } from "prismjs";
import {
  buildRouteSource,
  getRouteFiles,
  RouteFile,
} from "../../../../common/route-processing";
import styles from "./styles.module.css";
import { borderListStyles } from "../../components/BorderList";
import { TextModal } from "../../components/Modal";
import { toast } from "react-toastify";

const RouteGrammar: Grammar = {
  keyword: {
    pattern: /#ifdef(\s+\w+)?|#endif/,
    inside: {
      keyword: /#ifdef|#endif/,
      variable: /\w+/,
    },
  },
  comment: /#.*/,
  fragment: {
    pattern: /\{.*?\}|\{.*\}?/,
    inside: {
      keyword: { pattern: /(\{)(\w|\s)+/, lookbehind: true },
      "keyword control-flow": /[\|{}]/,
      property: /.+/,
    },
  },
};

function cloneRouteFiles(routeFiles: RouteFile[]) {
  return routeFiles.map((x) => ({ ...x }));
}

export default function EditRouteContainer() {
  const [routeFiles, setRouteFiles] = useRecoilState(routeFilesSelector);
  const resetRouteFiles = useResetRecoilState(routeFilesSelector);

  return (
    <RouteEditor
      routeFiles={routeFiles}
      onUpdate={(updatedRouteFiles) => setRouteFiles(updatedRouteFiles)}
      onReset={() => resetRouteFiles()}
    />
  );
}

interface RouteEditorProps {
  routeFiles: RouteFile[];
  onUpdate: (updatedRouteFiles: RouteFile[]) => void;
  onReset: () => void;
}

function RouteEditor({ routeFiles, onUpdate, onReset }: RouteEditorProps) {
  const [workingFiles, setWorkingFiles] = useState<RouteFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [importIsOpen, setImportIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setWorkingFiles(cloneRouteFiles(routeFiles));
    if (workingFiles.length !== routeFiles.length) setSelectedIndex(0);
  }, [routeFiles]);

  if (
    selectedIndex >= workingFiles.length ||
    routeFiles.length !== workingFiles.length
  )
    return <></>;

  const fileListItems = [];
  for (let i = 0; i < workingFiles.length; i++) {
    fileListItems.push(
      <div
        key={i}
        className={classNames(borderListStyles.itemRound, styles.fileListItem, {
          [styles.selected]: selectedIndex === i,
        })}
        onClick={() => {
          setSelectedIndex(i);
        }}
      >
        {workingFiles[i].name}
        {workingFiles[i].contents !== routeFiles[i].contents && "*"}
      </div>
    );
  }

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
              onUpdate(routeFiles);
            },
            {
              pending: "Importing Route",
              success: "Import Success",
              error: "Import Failed",
            }
          )
        }
      />
      <div className={classNames(formStyles.form, styles.workspaceForm)}>
        <div className={classNames(styles.workspace)}>
          <div className={classNames(styles.fileList)}>{fileListItems}</div>
          <div className={classNames(formStyles.formInput, styles.editor)}>
            {
              <Editor
                value={workingFiles[selectedIndex].contents}
                onValueChange={(value) => {
                  const updatedRouteFiles = [...workingFiles];
                  updatedRouteFiles[selectedIndex].contents = value;
                  setWorkingFiles(updatedRouteFiles);
                }}
                highlight={(value) =>
                  value !== undefined
                    ? highlight(value, RouteGrammar, "")
                    : value
                }
                tabSize={4}
                textareaClassName={classNames(styles.editorTextArea)}
              />
            }
          </div>
        </div>
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
              onUpdate(workingFiles);
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
