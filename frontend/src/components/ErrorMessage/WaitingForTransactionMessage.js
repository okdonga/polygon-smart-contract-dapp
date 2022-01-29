import React from "react";
import classnames from "classnames";
import styles from "./ErrorMessage.module.css";

export function WaitingForTransactionMessage({ txHash }) {
  return (
    <div className={classnames(styles.alert, styles.info)} role="alert">
      Waiting for transaction <strong>{txHash}</strong> to be mined
    </div>
  );
}
