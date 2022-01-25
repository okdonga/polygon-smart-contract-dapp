import * as React from "react";
import { WalletIcon } from "../Wallet";

const Header = ({ address, balance, tokenSymbol, winning }) => {
  const addressTrimmed = `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
    address.length
  )}`;

  return (
    <section>
      <fieldset>
        <div className="fieldset-item">
          <h1>
            <span>Welcome ✋🏽</span>
            {"     "}
            <button aria-label="Wallet address" type="button">
              {addressTrimmed} <WalletIcon />
            </button>
          </h1>

          <div className="fieldset-item__line-item">
            <span className="fieldset-item__line-item--sm-heading">
              <small>Total Value Locked:</small>
            </span>
            <span>
              {balance} {tokenSymbol}
            </span>
          </div>
          <div className="fieldset-item__line-item">
            <span className="fieldset-item__line-item--sm-heading">
              <small>Total winnnings:</small>
            </span>
            {winning} {tokenSymbol}
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default React.memo(Header);
