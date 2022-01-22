import * as React from "react";
import { ethers } from "ethers";
import { HARDHAT_NETWORK_ID } from "../constants";

export const useNetwork = () => {
  const { ethereum } = window;
  const [currentNetworkId, setCurrentNetworkId] = React.useState();
  const [networkError, setNetworkError] = React.useState();

  const _checkNetwork = () => {
    if (ethereum && ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    setNetworkError("Please connect Metamask to Localhost:8545");

    return false;
  };

  const _dismissNetworkError = () => {
    setNetworkError();
  };

  return {
    currentNetworkId,
    setCurrentNetworkId,
    networkError,
    setNetworkError,
    _checkNetwork,
    _dismissNetworkError,
  };
};
