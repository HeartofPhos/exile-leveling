import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
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
      onSubmit={(routeFiles) => setRouteFiles(routeFiles)}
      onReset={() => resetRouteFiles()}
    />
  );
}

interface RouteEditorProps {
  routeFiles: RouteFile[];
  onSubmit: (routeFiles: RouteFile[]) => void;
  onReset: () => void;
}

function RouteEditor({ routeFiles, onSubmit, onReset }: RouteEditorProps) {
  const [workingFiles, setWorkingFiles] = useState<RouteFile[]>([]);
  const [importIsOpen, setImportIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setWorkingFiles(cloneRouteFiles(routeFiles));
  }, [routeFiles]);

  useEffect(() => {
    const handler = (evt: KeyboardEvent) => {
      if ((evt.metaKey || evt.ctrlKey) && evt.key === "s") {
        evt.preventDefault();
        onSubmit(workingFiles);
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
              onSubmit(workingFiles);
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

interface WorkspaceProps {
  workingFiles: RouteFile[];
  isDirty: (workingFile: RouteFile, index: number) => boolean;
  onUpdate: (workingFiles: RouteFile[]) => void;
}

export function Workspace({ workingFiles, isDirty, onUpdate }: WorkspaceProps) {
  const formInputRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (selectedIndex >= workingFiles.length) setSelectedIndex(0);
  }, [workingFiles]);

  useEffect(() => {
    if (formInputRef.current === null) return;
    formInputRef.current.scrollTo(0, 0);
  }, [selectedIndex, formInputRef]);

  return (
    <div className={classNames(styles.workspace)}>
      {selectedIndex < workingFiles.length && workingFiles.length > 0 && (
        <>
          <div className={classNames(styles.fileList)}>
            {workingFiles.map((workingFile, i) => (
              <div
                key={i}
                className={classNames(
                  borderListStyles.itemRound,
                  styles.fileListItem,
                  {
                    [styles.selected]: selectedIndex === i,
                  }
                )}
                onClick={() => {
                  setSelectedIndex(i);
                }}
              >
                {workingFile.name}
                {isDirty(workingFile, i) && "*"}
              </div>
            ))}
          </div>
          <div
            ref={formInputRef}
            className={classNames(formStyles.formInput, styles.editor)}
          >
            {
              <Editor
                value={workingFiles[selectedIndex].contents}
                onValueChange={(value) => {
                  const updatedRouteFiles = [...workingFiles];
                  updatedRouteFiles[selectedIndex].contents = value;
                  onUpdate(updatedRouteFiles);
                }}
                highlight={(value) => highlight(value, RouteGrammar, "")}
                tabSize={4}
                textareaClassName={classNames(styles.editorTextArea)}
              />
            }
          </div>
        </>
      )}
    </div>
  );
}
