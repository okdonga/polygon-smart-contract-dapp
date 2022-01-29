import * as React from "react";
import DepositItem from "./DepositItem";

const WithdrawForm = ({ userInfo, winning, handleWithdraw }) => {
  const { address, goal, actual, valueLocked, reached } = userInfo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      handleWithdraw();
    } catch (err) {
      console.log(err);
    }
  };

  if (Object.keys(userInfo).length === 0) {
    return (
      <section>
        <header>
          <h2>Step 4. Alone done!</h2>
          <small>Claim your winnings!</small>
        </header>
        <fieldset></fieldset>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <header>
          <h2>Step 4. Alone done!</h2>
          <small>Claim your winnings!</small>
        </header>
        <fieldset>
          <DepositItem
            address={address}
            valueLocked={valueLocked}
            goalWeight={goal?.weight}
            goalIpfs={goal?.ipfs}
            reached={reached}
            isGameOver
          />
          <div className="fieldset-item">
            <picture aria-hidden="true">
              <img
                src={actual?.ipfs}
                alt="actual result"
                width="50"
                height="50"
              />
            </picture>
            <div className="sm-stack">
              <h4>Weight Actual: {actual?.weight} kg</h4>
            </div>
            <br />
            {reached && <button type="submit">Claim my winnings!</button>}
            {!reached && <h4>Sorry.. you did not reach the goal</h4>}
          </div>
        </fieldset>
      </section>
    </form>
  );
};

export default WithdrawForm;
