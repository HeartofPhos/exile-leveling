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
      {values.map((value, i) => {
        const isExcluded = excludeLine(value);

        // This function will only execute for non-excluded lines
        const handleClick = () => {
          navigator.clipboard.writeText(value);
          toast.success("Copied to Clipboard");
        };

        return (
          <div
            key={i}
            className={classNames(
              borderListStyles.itemRound,
              !isExcluded && interactiveStyles.hoverPrimary,
              !isExcluded && interactiveStyles.activePrimary,
              styles.searchString
            )}
            onClick={!isExcluded ? handleClick : undefined}
          >
            {/* Only render clipboard icon for non-excluded lines */}
            {!isExcluded && (
              <div onClick={handleClick}>
                <FaRegClipboard className={classNames("inlineIcon")} />
              </div>
            )}
            {value}
          </div>
        );
      })}
    </div>
  );
}
