import * as React from "react";
import { CopyIcon } from "../Icon";
import styles from "./Button.module.css";
import { copyTextToClipboard } from "../../utils";

const WalletButton = React.memo(function WalletButton({
  address,
  fullAddress,
}) {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleClick = React.useCallback(
    async (e) => {
      try {
        await copyTextToClipboard(fullAddress);
        setIsCopied(true);
      } catch (e) {
        console.log(e);
      }
    },
    [fullAddress]
  );

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  }, [isCopied]);

  return (
    <div className={styles.wallet}>
      {address}
      <CopyIcon handleClick={handleClick} />
      {isCopied && <small className={styles.small}>Copied!</small>}
    </div>
  );
});

export { WalletButton };
