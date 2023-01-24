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

interface RouteFile {
  name: string;
  contents: string;
}

function splitRouteFile(routeFile: string) {
  const routeLines = routeFile.split(/(?:\r\n|\r|\n)/g);

  const workingFiles: RouteFile[] = [];
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
      if (workingFile.contents !== "") workingFile.contents += "\n";
      workingFile.contents += line;
    }
  }

  return workingFiles;
}

function RouteEditor({ routeFile, onUpdate, onReset }: RouteEditorProps) {
  const [originalFiles, setOriginalFiles] = useState<RouteFile[]>([]);
  const [workingFiles, setWorkingFiles] = useState<RouteFile[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();

  useEffect(() => {
    const routeFiles = splitRouteFile(routeFile);
    setOriginalFiles(routeFiles);
    setWorkingFiles(structuredClone(routeFiles));
    if (selectedIndex === undefined) setSelectedIndex(0);
  }, [routeFile]);

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
        {workingFiles[i].contents !== originalFiles[i].contents && "*"}
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
              setWorkingFiles(structuredClone(workingFiles));
              onReset();
            }}
          >
            Reset
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onUpdate(
                workingFiles
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
