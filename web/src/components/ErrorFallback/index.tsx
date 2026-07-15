import styles from "./styles.module.css";
import classNames from "classnames";
import { type FallbackProps } from "react-error-boundary";

export function ErrorFallback({}: FallbackProps) {
  return (
    <span>
      {"Oops, something seems to have broken. Click "}
      <span
        className={classNames(styles.reset)}
        onClick={() => {
          localStorage.clear();
          location.reload();
        }}
      >
        here
      </span>
      {" to try and fix things."}
    </span>
  );
}
