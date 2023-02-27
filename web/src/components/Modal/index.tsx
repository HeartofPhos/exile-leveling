import classNames from "classnames";
import { useEffect, useRef } from "react";
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
  const valueRef = useRef<string>();

  useEffect(() => {
    if (!isOpen) valueRef.current = undefined;
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={classNames(formStyles.form, styles.grow)}>
        <div className={classNames(formStyles.formRow, styles.grow)}>
          <label>{label}</label>
          <textarea
            spellCheck={false}
            className={classNames(formStyles.formInput, styles.textInput)}
            onChange={(e) => {
              valueRef.current = e.target.value;
            }}
            autoFocus={true}
            aria-label={label}
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
              onSubmit(valueRef.current);
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}
