import classNames from "classnames";
import ReactModal from "react-modal";
import Modal from "react-modal";
import styles from "./styles.module.css";

Modal.setAppElement("#root");

export function ExileModal(props: ReactModal.Props) {
  return (
    <Modal
      className={classNames(styles.modal)}
      overlayClassName={classNames(styles.overlay)}
      {...props}
    />
  );
}
