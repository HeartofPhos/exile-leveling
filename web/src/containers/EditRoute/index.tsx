import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { formStyles } from "../../components/Form";
import { routeFileSelector } from "../../state/route";
import Editor from "react-simple-code-editor";
import { highlight, Grammar } from "prismjs";

import styles from "./EditRoute.module.css";

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

export default function EditRouteContainer() {
  const [routeFile, setRouteFile] = useRecoilState(routeFileSelector);
  const resetRouteFiles = useResetRecoilState(routeFileSelector);

  return (
    <RouteEditor
      routeFile={routeFile}
      onUpdate={(updatedRouteFile) => setRouteFile(updatedRouteFile)}
      onReset={() => resetRouteFiles()}
    />
  );
}

interface RouteEditorProps {
  routeFile: string;
  onUpdate: (updatedRouteFiles: string) => void;
  onReset: () => void;
}

interface WorkingFile {
  name: string;
  contents: string;
}

function routeFileToWorkingFiles(routeFile: string) {
  const routeLines = routeFile.split(/(?:\r\n|\r|\n)/g);

  const workingFiles: WorkingFile[] = [];
  for (let lineIndex = 0; lineIndex < routeLines.length; lineIndex++) {
    const line = routeLines[lineIndex];

    const sectionRegex = /^#section\s*(.*)/g;
    const sectionMatch = sectionRegex.exec(line);
    if (sectionMatch) {
      const sectionName = sectionMatch[1];
      workingFiles.push({
        name: sectionName,
        contents: "",
      });
    } else if (workingFiles.length == 0) {
      workingFiles.push({ name: "Missing Section Name", contents: "" });
    } else {
      const workingFile = workingFiles[workingFiles.length - 1];
      workingFile.contents += `${line}\n`;
    }
  }

  return workingFiles;
}

function RouteEditor({ routeFile, onUpdate, onReset }: RouteEditorProps) {
  const [workingRouteFiles, setWorkingRouteFiles] = useState<WorkingFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    setWorkingRouteFiles(routeFileToWorkingFiles(routeFile));
    setSelectedIndex(0);
  }, [routeFile]);

  const fileListItems = [];
  for (let i = 0; i < workingRouteFiles.length; i++) {
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
        {workingRouteFiles[i].name}
        {/* {workingRouteFiles[i] !== routeFiles[i] && "*"} */}
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
                value={workingRouteFiles[selectedIndex].contents}
                onValueChange={(value) => {
                  const updatedRouteFiles = [...workingRouteFiles];
                  updatedRouteFiles[selectedIndex].contents = value;
                  setWorkingRouteFiles(updatedRouteFiles);
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
              setWorkingRouteFiles(routeFileToWorkingFiles(routeFile));
              onReset();
            }}
          >
            Reset
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onUpdate(
                workingRouteFiles
                  .map((x) => `#section ${x.name}\n${x.contents}`)
                  .join("\n")
              );
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
