import { toast } from "react-toastify";
import { borderListStyles, interactiveStyles } from "../../styles";
import styles from "./styles.module.css";
import classNames from "classnames";
import { FaRegClipboard } from "react-icons/fa";

interface SearchStringProps {
  value: string;
}

export function SearchString({ value }: SearchStringProps) {
  return (
    <div
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
      <div>
        <FaRegClipboard className={classNames("inlineIcon")} />
      </div>
      {value}
    </div>
  );
}
