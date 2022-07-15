import classNames from "classnames";
import React from "react";
import styles from "./Form.module.css";

export const formStyles = styles;

interface FormProps {
  children?: React.ReactNode;
}

export function Form({ children }: FormProps) {
  return <div className={classNames(styles.form)}>{children}</div>;
}
