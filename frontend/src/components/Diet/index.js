import * as React from "react";

import DietArtifact from "../../contracts/DietChallenge.json";
import contractAddress from "../../contracts/contract-address.json";
// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected, ConnectWallet } from "../Wallet";
// import { Loading } from "../Common/Loading";
// import { Transfer } from "../TokenTransfer/Transfer";
// import { TransactionErrorMessage } from "../TokenTransfer/TransactionErrorMessage";
// import { WaitingForTransactionMessage } from "../TokenTransfer/WaitingForTransactionMessage";
// import { NoTokensMessage } from "../TokenTransfer/NoTokensMessage";

import "./Diet.css";
import Header from "./Header";
import DepositForm from "./DepositForm";
import DepositList from "./DepositList";
import SubmitResult from "./SubmitResult";
import WithdrawForm from "./WithdrawForm";
// import TBD from "./TBD";

import {
  etherToWei,
  getTotalValueLocked,
  getDeposits,
  getWinningAmount,
  getStatus,
  deposit,
  withdraw,
  submitResult,
  transformUserData,
  kilosToGrams,
  isTheSameAddress,
  freezeFunds,
  releaseFunds,
  withdrawAll,
  restart,
} from "../../utils";
import {
  useWallet,
  useContract,
  useNetwork,
  useContractWrite,
  useContractRead,
} from "../../hooks";
import { TOKEN_DECIMAL_UNIT } from "../../constants";

const DietTracker = () => {
  // The info of the token (i.e. It's Name and symbol)
  const [balance, setBalance] = React.useState();
  const [depositList, setDepositList] = React.useState([]);
  const [winning, setWinning] = React.useState();

  // The user's address ffand balance
  const {
    setCurrentNetworkId,
    networkError,
    setNetworkError,
    _checkNetwork,
    _dismissNetworkError,
  } = useNetwork();
  const { selectedAddress, setSelectedAddress } =
    useWallet(setCurrentNetworkId);
  const { contract, initializeContract } = useContract();
  const { updateMethod, setTransactionError, setTxBeingSent } =
    useContractWrite();
  const { readMethod, readError } = useContractRead();

  React.useEffect(() => {
    const init = async () => {
      await _connectWallet();
    };
    init();
  }, []);

  React.useEffect(() => {
    if (contract) {
      _updateBalance();
      getDepositList();
      getWinning();
    }
  }, [contract]);

  React.useEffect(() => {
    if (selectedAddress === undefined) {
      _resetState();
    }
  }, [selectedAddress]);

  const _connectWallet = async () => {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    try {
      // This opens a Metamask wallet popup, requesting the user to connect to their wallets
      const [selectedAddress] = await window.ethereum.send(
        "eth_requestAccounts",
        []
      );

      // Once we have the address, we can initialize the application.

      // First we check the network
      if (!_checkNetwork()) {
        return;
      }

      _initialize(selectedAddress);
    } catch (err) {
      // https://github.com/MetaMask/metamask-extension/issues/10085
      // There is an issue where the metamask wallet doesn't reopen
      // if it was accidentally closed the first time
      // the metamask team is working on a [fix](https://github.com/MetaMask/metamask-extension/issues/10085#issuecomment-768661193),
      // but in the meantime, alert the user to manually open the metamask wallet and
      // unlock their wallet
      console.log(err);
      alert("Please open the Metamask wallet and unlock your wallet");
    }
  };

  const _initialize = async (userAddress) => {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    setSelectedAddress(userAddress);

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    _intializeEthers();
  };

  const _intializeEthers = () => {
    initializeContract({
      address: contractAddress.DietChallenge,
      abi: DietArtifact.abi,
    });
  };

  const _updateBalance = async () => {
    const balance = await readMethod(contract, getTotalValueLocked, {
      unit: TOKEN_DECIMAL_UNIT,
    });
    setBalance(balance);
  };

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  const handleSubmitDeposit = async (weight, amount, ipfs) => {
    try {
      const options = { value: etherToWei(amount) };
      // Weight is saved in grams with no decimals, as solidity uint256 doesn't accept decimals
      const weightInGrams = kilosToGrams(parseFloat(weight).toFixed(2));

      const args = {
        ipfs,
        weight: weightInGrams,
        options,
      };

      await updateMethod(contract, deposit, args);
      await _updateBalance();
      // TODO: catch event DepositCreated
      // Then display step 2.
      // await getDepositList();
    } catch (error) {
      setTransactionError(error);
    }
  };

  const handleSubmitResult = async (weight, ipfs) => {
    try {
      const weightInGrams = kilosToGrams(parseFloat(weight));
      const args = {
        ipfs,
        weight: weightInGrams,
      };

      await updateMethod(contract, submitResult, args);
    } catch (error) {
      setTransactionError(error);
    }
  };

  const handleFreezeFunds = async () => {
    try {
      await updateMethod(contract, freezeFunds);
    } catch (error) {
      setTransactionError(error);
    }
  };

  const handleReleaseFunds = async () => {
    try {
      await updateMethod(contract, releaseFunds);
    } catch (error) {
      setTransactionError(error);
    }
  };

  const handleWithdraw = async () => {
    try {
      await updateMethod(contract, withdraw);
      await _updateBalance();
    } catch (error) {
      setTransactionError(error);
    }
  };

  const handleWithdrawAll = async () => {
    try {
      await updateMethod(contract, withdrawAll);
      await _updateBalance();
    } catch (error) {
      setTransactionError(error);
    }
  };

  const handleRestart = async () => {
    try {
      await updateMethod(contract, restart);
      await getDepositList();
      await _updateBalance();
    } catch (error) {
      setTransactionError(error);
    }
  };

  const getDepositList = async () => {
    const data = await readMethod(contract, getDeposits);
    setDepositList(data.map((userInfo) => transformUserData(userInfo)));
    const a = await readMethod(contract, getStatus);
    console.log(a);
    // console.log(([2]);
    // getWinning();
  };

  const getWinning = async () => {
    const data = await readMethod(contract, getWinningAmount);
    setWinning(data.toString());
  };

  const filterDeposit = () => {
    const fn = isTheSameAddress(selectedAddress);
    return depositList.find(fn) || {};
  };

  const _resetState = () => {
    // The user's address and balance
    setSelectedAddress();
    setBalance();
    // The ID about transactions being sent, and any possible error with them
    setTxBeingSent();
    setTransactionError();
    setNetworkError();
  };

  // Ethereum wallets inject the window.ethereum object. If it hasn't been
  // injected, we instruct the user to install MetaMask.
  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  // The next thing we need to do, is to ask the user to connect their wallet.
  // When the wallet gets connected, we are going to save the users's address
  // in the component's state. So, if it hasn't been saved yet, we have
  // to show the ConnectWallet component.
  //
  // Note that we pass it a callback that is going to be called when the user
  // clicks a button. This callback just calls the _connectWallet method.
  if (!selectedAddress) {
    return (
      <ConnectWallet
        connectWallet={_connectWallet}
        networkError={networkError}
        dismiss={_dismissNetworkError}
      />
    );
  }

  const userDeposit = filterDeposit();

  return (
    <React.Fragment>
      <main>
        <Header address={selectedAddress} balance={balance} winning={winning} />

        {/* Step 1 */}
        <DepositForm handleSubmitDeposit={handleSubmitDeposit} />
        {/* Step 2 */}
        <DepositList list={depositList} />
        {/* Step 3 */}
        <SubmitResult
          userInfo={userDeposit}
          handleSubmitResult={handleSubmitResult}
        />
        {/* Step 4 */}
        <WithdrawForm
          userInfo={userDeposit}
          winning={winning}
          handleWithdraw={handleWithdraw}
        />

        {/* <TBD />  */}

        {/* ADMIN SECTION */}
        <section>
          <header>
            <h2>[Admin only]</h2>
            <small>For debugging</small>
          </header>
          <fieldset>
            <div className="fieldset-item">
              <button type="button" onClick={handleFreezeFunds}>
                freeze
              </button>
              <button type="button" onClick={handleReleaseFunds}>
                release
              </button>
              <button type="button" onClick={handleWithdrawAll}>
                withdrawAll
              </button>
              <button type="button" onClick={handleRestart}>
                restart
              </button>
            </div>
          </fieldset>
        </section>
      </main>
    </React.Fragment>
  );
};

export default DietTracker;
