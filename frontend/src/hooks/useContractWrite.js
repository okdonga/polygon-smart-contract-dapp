import * as React from "react";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export const useContractWrite = () => {
  // The ID about transactions being sent, and any possible error with them
  const [txBeingSent, setTxBeingSent] = React.useState();
  const [transactionError, setTransactionError] = React.useState();

  //   const { ethereum } = window;

  //   await ethereum.request({
  //     method: methodName,
  //     params: [
  //       {
  //         to: _contract,
  //       },
  //     ],
  //   });

  const _dismissTransactionError = () => {
    setTransactionError();
  };

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  const updateMethod = async (contract, transaction, args) => {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.
    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      _dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await transaction(contract, args);
      setTxBeingSent(tx.hash);

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();
      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      }
      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      alert(error?.data?.message);
      setTransactionError(error);
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      setTxBeingSent();
    }
  };

  return {
    updateMethod,
    transactionError,
    setTransactionError,
    setTxBeingSent,
  };
};
