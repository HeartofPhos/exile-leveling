import { RouteData } from "../../../../../common/route-processing/types";
import { CodeEditor } from "../../CodeEditor";
import { SelectList } from "../../SelectList";
import styles from "./styles.module.css";
import classNames from "classnames";
import { Grammar } from "prismjs";
import { useEffect, useRef, useState } from "react";

const RouteGrammar: Grammar = {
  preProcessors: {
    pattern: /#section *(.*)|#endif|#ifdef *(.*)|#ifndef *(.*)/,
    inside: {
      "keyword control-flow": /#\w+/,
      variable: /.+/,
    },
  },
  subStep: {
    alias: "keyword control-flow",
    pattern: /#sub/,
  },
  comment: /#.*/,
  fragment: {
    pattern: /\{.*?\}|\{.*\}?/,
    inside: {
      keyword: { pattern: /(\{)[^|{}]+/, lookbehind: true },
      "keyword control-flow": /[|{}]/,
      property: /.+/,
    },
  },
};

interface WorkspaceProps {
  workingFiles: RouteData.RouteFile[];
  isDirty: (workingFile: RouteData.RouteFile, index: number) => boolean;
  onUpdate: (workingFiles: RouteData.RouteFile[]) => void;
}

export function Workspace({ workingFiles, isDirty, onUpdate }: WorkspaceProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (selectedIndex >= workingFiles.length) setSelectedIndex(0);
  }, [workingFiles]);

  useEffect(() => {
    if (inputRef.current === null) return;
    inputRef.current.scrollTo(0, 0);
  }, [selectedIndex, inputRef]);

  return (
    <div className={classNames(styles.workspace)}>
      {selectedIndex < workingFiles.length && (
        <>
          <SelectList
            items={workingFiles}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            getLabel={(index) => {
              const workingFile = workingFiles[index];
              return isDirty(workingFile, index)
                ? workingFile.name + "*"
                : workingFile.name;
            }}
          />
          <CodeEditor
            ref={inputRef}
            grammar={RouteGrammar}
            value={workingFiles[selectedIndex].contents}
            onValueChange={(value) => {
              const updatedRouteFiles = [...workingFiles];
              updatedRouteFiles[selectedIndex].contents = value;
              onUpdate(updatedRouteFiles);
            }}
          />
        </>
      )}
    </div>
  );
}
