import styles from "./styles.module.css";
import classNames from "classnames";
import { FaRegClipboard } from "react-icons/fa";
import { toast } from "react-toastify";

interface CopyToClipboardProps {
  text: string;
}

export function CopyToClipboard({ text }: CopyToClipboardProps) {
  return (
    <span
      className={classNames(styles.copy)}
      onClick={(e) => {
        navigator.clipboard.writeText(text);
        toast.success(
          <div>
            Copied to Clipboard
            <br />
            {text}
          </div>
        );
        e.stopPropagation();
      }}
    >
      <FaRegClipboard className={classNames("inlineIcon")} />
    </span>
  );
}
