import { SearchString } from "../../state/search-strings";
import { borderListStyles, interactiveStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import { FaRegClipboard } from "react-icons/fa";
import { toast } from "react-toastify";

interface SearchStringsProps {
  values: SearchString[];
}

export function SearchStrings({ values }: SearchStringsProps) {
  return (
    <div className={classNames(styles.searchStrings)}>
      {values.map((value, i) => (
        <div
          key={i}
          className={classNames(
            borderListStyles.itemRound,
            interactiveStyles.hoverPrimary,
            interactiveStyles.activePrimary,
            styles.searchString
          )}
          onClick={() => {
            navigator.clipboard.writeText(value.text);
            toast.success("Copied to Clipboard");
          }}
        >
          <div>
            <FaRegClipboard className={classNames("inlineIcon")} />
          </div>
          {value.alias || value.text}
        </div>
      ))}
    </div>
  );
}
