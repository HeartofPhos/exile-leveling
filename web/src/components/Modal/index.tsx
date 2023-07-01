import styles from "./styles.module.css";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import ReactModal from "react-modal";
import { formStyles } from "../../styles";

ReactModal.setAppElement("#root");

interface ModalSizeProps {
  size: "small" | "large";
}

export function Modal(props: ReactModal.Props & ModalSizeProps) {
  return (
    <ReactModal
      className={classNames(styles.modal, styles[props.size])}
      overlayClassName={classNames(styles.overlay)}
      {...props}
    />
  );
}

interface TextModalProps extends ModalSizeProps {
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
  size,
}: TextModalProps) {
  const valueRef = useRef<string>();

  useEffect(() => {
    if (!isOpen) valueRef.current = undefined;
  }, [isOpen]);

  return (
    <Modal size={size} isOpen={isOpen} onRequestClose={onRequestClose}>
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
