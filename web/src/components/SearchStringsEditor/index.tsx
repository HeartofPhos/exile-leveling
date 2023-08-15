import { searchStringsAtom } from "../../state/search-strings";
import { formStyles } from "../../styles";
import { CodeEditor } from "../CodeEditor";
import styles from "./styles.module.css";
import classNames from "classnames";
import { Grammar } from "prismjs";
import { useRecoilState } from "recoil";

const SearchStringGrammar: Grammar = {
  comment: /#.*/,
};

export function SearchStringsEditor() {
  const [searchStrings, setSearchStrings] = useRecoilState(searchStringsAtom);

  return (
    <div className={classNames(formStyles.formRow)}>
      <label>
        Search Strings {"("}
        <a href="https://poe.re/" target="_blank">
          Path of Exile Regex
        </a>
        {/* TODO Should add some hints for alias format */}
        {")"}
      </label>
      <CodeEditor
        className={classNames(styles.input)}
        grammar={SearchStringGrammar}
        value={searchStrings?.join("\n") || ""}
        onValueChange={(value) => {
          if (value.length == 0) setSearchStrings(null);
          else setSearchStrings(value.split(/\r\n|\r|\n/));
        }}
      />
    </div>
  );
}
