import * as React from "react";
import DepositItem from "./DepositItem";
import { uploadToIpfs } from "../../utils";

const SubmitResult = ({ userInfo, handleSubmitResult }) => {
  const { address, goal, actual, valueLocked } = userInfo;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const weight = formData.get("weight");
    const file = formData.get("file");

    if (formData && weight) {
      try {
        const url = await uploadToIpfs(file);
        console.log(url);
        handleSubmitResult(weight, url);
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (Object.keys(userInfo).length === 0) {
    return (
      <section>
        <header>
          <h2>Step 3. Verify result</h2>
          <small>Did you achieve your goal?</small>
        </header>
        <fieldset></fieldset>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <header>
          <h2>Step 3. Verify result</h2>
          <small>Did you achieve your goal?</small>
        </header>

        <fieldset>
          <DepositItem
            address={address}
            valueLocked={valueLocked}
            goalWeight={goal?.weight}
            goalIpfs={goal?.ipfs}
          />
          <div className="fieldset-item">
            <div className="sm-stack">
              <h3>Record your result!</h3>
              <label htmlFor="weight" className="sm-stack left-align">
                <small>Put down your current weight (unit: KG)</small>
              </label>
              <div className="weight-container">
                <input
                  required
                  type="text"
                  id="weight"
                  name="weight"
                  placeholder="50.0"
                  className="weight-container__input"
                />
                <span className="weight-container__text">kg</span>
              </div>
              <hr />
              <label htmlFor="file" className="sm-stack">
                <small>Upload a picture of your weight</small>
              </label>
              <div>
                <input required type="file" id="file" name="file" />
              </div>
              <br />
              <button type="submit">Submit</button>
            </div>
          </div>
        </fieldset>
      </section>
    </form>
  );
};

export default SubmitResult;
