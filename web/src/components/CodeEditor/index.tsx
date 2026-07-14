import { formStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import { type Grammar, highlight } from "prismjs";
import React from "react";
import ReactSimpleCodeEditor from "react-simple-code-editor";

const Editor = (ReactSimpleCodeEditor as any).default as typeof ReactSimpleCodeEditor;

interface CodeEditorProps {
  grammar: Grammar;
  value: string;
  onValueChange: (value: string) => void;
}

export const CodeEditor = React.forwardRef<
  HTMLDivElement,
  CodeEditorProps & React.HTMLAttributes<HTMLDivElement>
>(({ grammar, value, onValueChange, className, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      className={classNames(className, formStyles.formInput, styles.editor)}
      {...rest}
    >
      <Editor
        highlight={(value) => highlight(value, grammar, "")}
        tabSize={4}
        className={classNames(styles.editorDiv)}
        textareaClassName={classNames(styles.editorTextArea)}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
});
