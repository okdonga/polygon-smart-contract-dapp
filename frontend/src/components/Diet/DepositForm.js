import * as React from "react";
import { uploadToIpfs } from "../../utils";
import { tokenSymbol } from "../../constants";
import MaticLogo from "../../assets/polygon-matic-logo.svg";

function returnFileSize(number) {
  if (number < 1024) {
    return number + "bytes";
  } else if (number >= 1024 && number < 1048576) {
    return (number / 1024).toFixed(1) + "KB";
  } else if (number >= 1048576) {
    return (number / 1048576).toFixed(1) + "MB";
  }
}

const DepositForm = ({ handleSubmitDeposit }) => {
  const [input, setInput] = React.useState({
    weight: undefined,
    amount: undefined,
  });
  const fileRef = React.useRef();

  const handleKeyDown = (e) => {
    if (e.key === "e") {
      e.preventDefault();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target || {};
    setInput({ ...input, [name]: value });
  };

  const isValid = (form) => {
    if (form) {
      if (!fileRef.current.value) {
        alert("Please select a file");
        return false;
      }

      if (returnFileSize(fileRef.current.files[0]?.size) > "10MB") {
        alert("File size must be less than 10MB");
        return false;
      }

      form.reportValidity();
      return form.checkValidity();
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { target } = e;
    if (isValid(target)) {
      const { weight, amount } = input;
      const file = fileRef?.current?.files[0];
      if (weight && amount && file) {
        try {
          const url = await uploadToIpfs(file);
          handleSubmitDeposit(parseFloat(weight).toFixed(2), amount, url);
          resetValues();
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const resetValues = () => {
    fileRef.current.value = null;
    setInput({
      weight: undefined,
      amount: undefined,
    });
  };

  const { weight, amount } = input;

  return (
    <form onSubmit={handleSubmit} noValidate id="depositForm">
      <section>
        <header>
          <h2>Step 1. Put your target weight and bet {tokenSymbol}</h2>
          <small>How much {tokenSymbol} will you bet?</small>
        </header>

        <fieldset>
          <div className="fieldset-item">
            <div className="sm-stack">
              <h3>Set your target weight</h3>
              <label htmlFor="weight" className="sm-stack">
                <small>
                  What is your target weight? (unit: KG, rounded to 2 decimals)
                </small>
              </label>
              <div className="weight-container">
                <input
                  required
                  value={weight}
                  type="number"
                  id="weight"
                  name="weight"
                  placeholder="50.00"
                  min="0"
                  step="0.01"
                  max="200"
                  className="weight-container__input"
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                />
                <span className="weight-container__text">kg</span>
              </div>
              <label htmlFor="amount" className="sm-stack left-align">
                <small>
                  How much {tokenSymbol} will you bet? (unit: {tokenSymbol})
                </small>
              </label>
              <div className="currency-input">
                <img src={MaticLogo} width="16px" alt="matic-icon" />
                <input
                  required
                  value={amount}
                  type="number"
                  id="amount"
                  name="amount"
                  placeholder="0.001"
                  min="0"
                  max="1000"
                  step="0.000000000000000000" // 18 decimals
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="file" className="sm-stack">
                <small>Upload a picture of your weight</small>
              </label>
              <div>
                <input
                  required
                  ref={fileRef}
                  type="file"
                  id="file"
                  name="file"
                  accept=".jpg, .jpeg, .png, .svg"
                />
              </div>
              <br />
              <button type="submit">Submit bet</button>
            </div>
          </div>
        </fieldset>
      </section>
    </form>
  );
};

export default DepositForm;
