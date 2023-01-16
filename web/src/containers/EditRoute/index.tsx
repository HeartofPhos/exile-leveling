import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";
import { Form, formStyles } from "../../components/Form";
import { routeFilesAtom } from "../../state/route";

import styles from "./EditRoute.module.css";

export default function EditRouteContainer() {
  const [routeFiles, setRouteFiles] = useRecoilState(routeFilesAtom);
  const resetRouteFiles = useResetRecoilState(routeFilesAtom);

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

  useEffect(() => {
    setWorkingRouteFiles(routeFiles);
  }, [routeFiles]);

  return (
    <>
      <Form>
        {workingRouteFiles.map((x, i) => (
          <div key={i} className={classNames(formStyles.formRow)}>
            <label>Act {i + 1}</label>
            <textarea
              className={classNames(formStyles.formInput, styles.routeInput)}
              onChange={(e) => {
                const updatedRouteFiles = [...workingRouteFiles];
                updatedRouteFiles[i] = e.target.value;
                setWorkingRouteFiles(updatedRouteFiles);
              }}
              spellCheck={false}
              value={x}
            />
          </div>
        ))}
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
