import React from "react";
import classnames from "classnames";
import styles from "./ErrorMessage.module.css";

export function TransactionErrorMessage({ message, dismiss }) {
  return (
    <div className={classnames(styles.alert, styles.danger)} role="alert">
      Error sending transaction: {message.substring(0, 100)}
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
