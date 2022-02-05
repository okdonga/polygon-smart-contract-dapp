import * as React from "react";
import styles from "./Icon.module.css";

export const WalletIcon = () => {
  return (
    <div className={styles.walleticon}>
      <svg x="0" y="0" width="16" height="16">
        <rect
          x="0"
          y="0"
          width="16"
          height="16"
          transform="translate(1.1375779928440009 2.187960923928009) rotate(71.0 8 8)"
          fill="#F58B00"
        ></rect>
        <rect
          x="0"
          y="0"
          width="16"
          height="16"
          transform="translate(2.583359046608032 5.767713125167346) rotate(121.5 8 8)"
          fill="#C81477"
        ></rect>
        <rect
          x="0"
          y="0"
          width="16"
          height="16"
          transform="translate(-10.291987116943679 9.784511836118764) rotate(266.2 8 8)"
          fill="#18CDF2"
        ></rect>
      </svg>
    </div>
  );
};
