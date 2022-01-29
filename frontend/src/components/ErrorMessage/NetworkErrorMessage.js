import React from "react";
import styles from "./ErrorMessage.module.css";

export function NetworkErrorMessage({ message, dismiss }) {
  return (
    <div role="alert" className={styles.alert}>
      {message}
      <button
        type="button"
        className={styles.close}
        data-dismiss="alert"
        aria-label="Close"
        onClick={dismiss}
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
