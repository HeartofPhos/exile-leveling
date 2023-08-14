import { formStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import { Grammar, highlight } from "prismjs";
import Editor from "react-simple-code-editor";

interface CodeEditorProps {
  grammar: Grammar;
  value: string;
  onValueChange: (value: string) => void;
}

export function CodeEditor({
  grammar,
  value,
  onValueChange,
  className,
  ...rest
}: CodeEditorProps &
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >) {
  return (
    <div
      className={classNames(className, formStyles.formInput, styles.editor)}
      {...rest}
    >
      <Editor
        highlight={(value) => highlight(value, grammar, "")}
        tabSize={4}
        textareaClassName={classNames(styles.editorTextArea)}
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
}
