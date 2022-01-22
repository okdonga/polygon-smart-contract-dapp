import * as React from "react";

const DepositItem = ({
  address,
  valueLocked,
  goalWeight,
  goalIpfs,
  reached,
  isGameOver,
}) => {
  return (
    <div className="fieldset-item">
      <picture aria-hidden="true">
        <img src={goalIpfs} alt="NFT owned by user" width="50" height="50" />
      </picture>
      <div className="sm-stack">
        <strong>{address}</strong>
      </div>
      <div className="sm-stack">
        <h4>TVL ⧫ {valueLocked}</h4>
      </div>
      <div className="sm-stack">
        <h4>Weight To-be: {goalWeight} kg</h4>
      </div>
      {isGameOver && (
        <>
          <div className="sm-stack">
            <h4>Goal reached? {reached ? "👍🏽" : `👎`}</h4>
          </div>
          <div className="sm-stack">
            <h4>Claimed? {valueLocked > 0 ? "Not yet" : `YES`}</h4>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(DepositItem);
