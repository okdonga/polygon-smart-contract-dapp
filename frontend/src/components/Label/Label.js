import * as React from "react";
import styles from "./Label.module.css";

const RoundLabel = React.memo(function RoundLabel({ text }) {
  return (
    <span className={styles.label}>
      <small>{text}</small>
    </span>
  );
});

export { RoundLabel };
