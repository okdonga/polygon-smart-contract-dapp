import * as React from "react";
import classnames from "classnames";
import { WalletButton } from "../Button";
import { RoundLabel } from "../Label";
import { tokenSymbol, WEIGHT_UNIT } from "../../constants";
import { trimAddress } from "../../utils";

const DepositItem = ({
  address,
  valueLocked,
  goalWeight,
  goalIpfs,
  reached,
  isGameOver,
}) => {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const addressTrimmed = React.useMemo(() => trimAddress(address), [address]);

  const handleClickImage = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="fieldset-item">
      <picture
        // aria-hidden="true"
        onClick={handleClickImage}
        className={classnames({
          "zoomed-in overlay": isZoomed,
          "zoomed-out": !isZoomed,
        })}
      >
        <img src={goalIpfs} alt="NFT owned by user" width="421" height="150" />
      </picture>
      <div className="fieldset-item__line-item">
        <RoundLabel text="Address:" />
        <WalletButton address={addressTrimmed} fullAddress={address} />
      </div>

      <div className="fieldset-item__line-item">
        <RoundLabel text="Total Value Locked:" />
        {valueLocked} {tokenSymbol}
      </div>
      <div className="fieldset-item__line-item">
        <RoundLabel text="Target Weight:" />
        {goalWeight} {WEIGHT_UNIT}
      </div>
      {isGameOver && (
        <>
          <hr />
          <div className="fieldset-item__line-item">
            <RoundLabel text="Goal reached?" />
            {reached ? "👍🏽" : `👎`}
          </div>
          <div className="fieldset-item__line-item">
            <RoundLabel text="Claimed?" />
            {valueLocked > 0 ? "Not yet" : `YES`}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(DepositItem);
