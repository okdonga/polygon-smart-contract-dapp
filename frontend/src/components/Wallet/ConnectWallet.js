import React from "react";
import styles from "./Wallet.module.css";

import { NetworkErrorMessage } from "../ErrorMessage/NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <main>
      <div>
        {/* Metamask network should be set to Localhost:8545. */}
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}
      </div>
      <section>
        <header className={styles.header}>
          <p>Please connect to your wallet.</p>
          <br />
          <button type="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        </header>
      </section>
    </main>
  );
}
