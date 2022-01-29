import * as React from "react";
import { WalletIcon } from "../Wallet";
import CopyAddressIcon from "../../assets/copy-address.svg";
import styles from "./Button.module.css";

const WalletButton = React.memo(function WalletButton({ address }) {
  const handleClick = () => {
    // copy
  };

  return (
    <>
      <button
        aria-label="Wallet address"
        type="button"
        className={styles.container}
      >
        <div className={styles.wallet}>
          <span>{address}</span>
          <WalletIcon />
        </div>
        <div className={styles.copy}>
          <img src={CopyAddressIcon} width="16px" alt="Copy address" />
          <span>Copy Address</span>
        </div>
      </button>
      {/* <button aria-label="Wallet address" type="button" onClick={handleClick}>
        <img src={CopyAddressIcon} width="16px" alt="Copy address" />
        Copy Address
      </button> */}
    </>
  );
});

export { WalletButton };
