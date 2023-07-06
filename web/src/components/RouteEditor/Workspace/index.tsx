import { RouteData } from "../../../../../common/route-processing/types";
import { formStyles } from "../../../styles";
import { SelectList } from "../../SelectList";
import styles from "./styles.module.css";
import classNames from "classnames";
import { Grammar, highlight } from "prismjs";
import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";

const RouteGrammar: Grammar = {
  keyword: {
    pattern: /#section *(.*)|#endif|#ifdef *(.*)|#ifndef *(.*)/,
    inside: {
      "keyword control-flow": /#\w+/,
      variable: /.+/,
    },
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
          <div
            ref={formInputRef}
            className={classNames(formStyles.formInput, styles.editor)}
          >
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
          </div>
        </>
      )}
    </div>
  );
}
