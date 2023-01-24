import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { formStyles } from "../../components/Form";
import { routeFilesSelector } from "../../state/route";
import Editor from "react-simple-code-editor";
import { highlight, Grammar } from "prismjs";

import styles from "./EditRoute.module.css";
import { RouteFile } from "../../../../common/route-processing";

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
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    setWorkingFiles(cloneRouteFiles(routeFiles));
    if (selectedIndex === undefined) setSelectedIndex(0);
  }, [routeFiles]);

  const fileListItems = [];
  for (let i = 0; i < workingFiles.length; i++) {
    fileListItems.push(
      <div
        key={i}
        className={classNames("borderListItem", styles.fileListItem, {
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
      <div className={classNames(formStyles.form, styles.workspaceForm)}>
        <div className={classNames(styles.workspace)}>
          <div className={classNames(styles.fileList)}>{fileListItems}</div>
          <div className={classNames(formStyles.formInput, styles.editor)}>
            {selectedIndex !== undefined && (
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
            )}
          </div>
        </div>
        <div className={classNames(formStyles.groupRight)}>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              setWorkingFiles(routeFiles);
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
