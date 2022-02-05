import * as React from "react";
import { WalletButton } from "../Button";
import { RoundLabel } from "../Label";
import { tokenSymbol } from "../../constants";
import { trimAddress } from "../../utils";

const Header = ({ address, balance, winning }) => {
  const addressTrimmed = React.useMemo(() => trimAddress(address), [address]);

  return (
    <section>
      <fieldset>
        <div className="fieldset-item">
          <h1>
            <WalletButton address={addressTrimmed} fullAdddress={address} />
          </h1>

          <div className="fieldset-item__line-item">
            <RoundLabel text="Total Value Locked:" />
            <span>
              {balance} {tokenSymbol}
            </span>
          </div>
          <div className="fieldset-item__line-item">
            <RoundLabel text="Total winnnings:" />
            {winning} {tokenSymbol}
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default React.memo(Header);
