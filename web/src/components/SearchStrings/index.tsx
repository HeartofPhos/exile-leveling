import { borderListStyles, interactiveStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import { FaRegClipboard } from "react-icons/fa";
import { toast } from "react-toastify";

interface SearchStringsProps {
  values: string[];
}

export function SearchStrings({ values }: SearchStringsProps) {

  const excludeLine = (line: string): boolean => {
    const exclusionCharacter = "#";
    return line.includes(exclusionCharacter);
  };

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
            navigator.clipboard.writeText(value);
            toast.success("Copied to Clipboard");
          }}
        >
          {/* Only render clipboard icon and add copy functionality if line shouldn't be excluded */}
          {!excludeLine(value) && (
            <div onClick={() => {
              navigator.clipboard.writeText(value);
              toast.success("Copied to Clipboard");
            }}>
            <FaRegClipboard className={classNames("inlineIcon")} />
          </div>
          )}
          {value}
        </div>
      ))}
    </div>
  );
}
