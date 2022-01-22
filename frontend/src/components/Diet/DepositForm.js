import * as React from "react";
import { uploadToIpfs } from "../../utils";
import { tokenSymbol } from "../../constants";

const DepositForm = ({ handleSubmitDeposit }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const weight = formData.get("weight");
    const amount = formData.get("deposit");
    const file = formData.get("file");

    if (weight && amount && file) {
      try {
        const url = await uploadToIpfs(file);
        handleSubmitDeposit(weight, amount, url);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <header>
          <h2>Step 1. Set your goal and lock {tokenSymbol}</h2>
          <small>How much do you want to lock your eth?</small>
        </header>

        <fieldset>
          <div className="fieldset-item">
            <div className="sm-stack">
              <h3>Set your goal</h3>
              <label htmlFor="weight" className="sm-stack">
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
              <label htmlFor="deposit" className="sm-stack left-align">
                <small>
                  How much eth will you deposit? (unit: {tokenSymbol})
                </small>
              </label>
              <div className="currency-input">
                ⧫
                <input
                  required
                  type="text"
                  id="deposit"
                  name="deposit"
                  placeholder="0.001"
                />
              </div>
              <label htmlFor="file" className="sm-stack">
                <small>Upload a picture of your weight</small>
              </label>
              <div>
                <input required type="file" id="file" name="file" />
              </div>
              <br />
              <button type="submit">Deposit</button>
            </div>
          </div>
        </fieldset>
      </section>
    </form>
  );
};

export default DepositForm;
