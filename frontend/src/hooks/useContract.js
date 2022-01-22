import * as React from "react";
import { ethers } from "ethers";

export const useContract = () => {
  const { ethereum } = window;
  const [contract, setContract] = React.useState();

  const initializeContract = ({ address, abi }) => {
    if (ethereum) {
      // We first initialize ethers by creating a provider using window.ethereum
      const _provider = new ethers.providers.Web3Provider(window.ethereum);

      // When, we initialize the contract using that provider and the token's
      // artifact. You can do this same thing with your contracts.
      const _contract = new ethers.Contract(
        address,
        abi,
        _provider.getSigner(0)
      );

      setContract(_contract);
      return _contract;
    }
  };

  return { contract, initializeContract };
};
