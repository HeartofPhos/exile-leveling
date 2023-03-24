import { RouteFile } from "../../../../../common/route-processing/types";
import { formStyles } from "../../Form";
import { FileList } from "../FileList";
import styles from "./styles.module.css";
import classNames from "classnames";
import { Grammar, highlight } from "prismjs";
import { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";

const RouteGrammar: Grammar = {
  keyword: {
    pattern: /#section *(.*)|#ifdef *(.*)|#endif/,
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
      {selectedIndex < workingFiles.length && (
        <>
          <FileList
            selectedIndex={selectedIndex}
            routeFiles={workingFiles}
            isDirty={isDirty}
            onSelect={setSelectedIndex}
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
