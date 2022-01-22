import * as React from "react";
import DepositItem from "./DepositItem";

const DepositList = ({ list = [] }) => {
  return (
    <section>
      <header>
        <h2>Step 2. Check your deposits</h2>
        <small>This is locked in the contract until the end of challenge</small>
      </header>

      <fieldset>
        {list.map(({ address, valueLocked, goal, reached }) => (
          <DepositItem
            key={address}
            address={address}
            valueLocked={valueLocked}
            goalWeight={goal.weight}
            goalIpfs={goal.ipfs}
            reached={reached}
          />
        ))}
      </fieldset>
    </section>
  );
};

export default DepositList;
