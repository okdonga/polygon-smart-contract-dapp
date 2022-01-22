import * as React from "react";
import { NETWORK_ID, NETWORK_ID_TO_NAME } from "../constants";

export const useNetwork = () => {
  const { ethereum } = window;
  const [currentNetworkId, setCurrentNetworkId] = React.useState();
  const [networkError, setNetworkError] = React.useState();

  const _checkNetwork = () => {
    // if (ethereum && ethereum.networkVersion === HARDHAT_NETWORK_ID) {
    if (ethereum && ethereum.networkVersion === NETWORK_ID) {
      return true;
    }

    setNetworkError(
      `Please connect Metamask to ${NETWORK_ID_TO_NAME[NETWORK_ID]}`
    );

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
