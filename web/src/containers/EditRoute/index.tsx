import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Form, formStyles } from "../../components/Form";
import { routeFilesSelector } from "../../state/route";
import Editor from "react-simple-code-editor";

import styles from "./EditRoute.module.css";

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
  routeFiles: string[];
  onUpdate: (updatedRouteFiles: string[]) => void;
  onReset: () => void;
}

function RouteEditor({ routeFiles, onUpdate, onReset }: RouteEditorProps) {
  const [workingRouteFiles, setWorkingRouteFiles] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    setWorkingRouteFiles(routeFiles);
  }, [routeFiles]);

  return (
    <>
      <Form>
        <div className={classNames(styles.workspace)}>
          <div className={classNames(styles.fileList)}>
            {workingRouteFiles.map((x, i) => (
              <div
                className={classNames("borderListItem", styles.fileListItem, {
                  [styles.selected]: selectedIndex === i,
                })}
                onClick={() => {
                  setSelectedIndex(i);
                }}
              >
                Act {i + 1}
              </div>
            ))}
          </div>
          <div className={classNames(formStyles.formInput, styles.editor)}>
            <Editor
              value={workingRouteFiles[selectedIndex]}
              onValueChange={(value) => {
                const updatedRouteFiles = [...workingRouteFiles];
                updatedRouteFiles[selectedIndex] = value;
                setWorkingRouteFiles(updatedRouteFiles);
              }}
              highlight={(value) => value}
              style={{ fontFamily: "Consolas" }}
            />
          </div>
        </div>
        <div className={classNames(formStyles.groupRight)}>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onReset();
            }}
          >
            Reset
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onUpdate(workingRouteFiles);
            }}
          >
            Save
          </button>
        </div>
      </Form>
      <hr />
    </>
  );
}
