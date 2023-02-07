import classNames from "classnames";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { formStyles } from "../Form";
import styles from "./styles.module.css";

ReactModal.setAppElement("#root");

export function Modal(props: ReactModal.Props) {
  return (
    <ReactModal
      className={classNames(styles.modal)}
      overlayClassName={classNames(styles.overlay)}
      {...props}
    />
  );
}

interface TextModalProps {
  label: string;
  isOpen: boolean;
  onSubmit: (value: string | undefined) => void;
  onRequestClose: () => void;
}

export function TextModal({
  label,
  isOpen,
  onSubmit,
  onRequestClose,
}: TextModalProps) {
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (!isOpen) setValue(undefined);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={classNames(formStyles.form, styles.grow)}>
        <div className={classNames(formStyles.formRow, styles.grow)}>
          <label>{label}</label>
          <textarea
            spellCheck={false}
            className={classNames(formStyles.formInput, styles.textInput)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus={true}
          />
        </div>
        <div className={classNames(formStyles.groupRight)}>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onRequestClose();
            }}
          >
            Cancel
          </button>
          <button
            className={classNames(formStyles.formButton)}
            onClick={() => {
              onRequestClose();
              onSubmit(value);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}
