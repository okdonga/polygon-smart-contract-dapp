import * as React from "react";

export const useWallet = (setCurrentNetworkId) => {
  const { ethereum } = window;
  const [selectedAddress, setSelectedAddress] = React.useState();
  // const { setCurrentNetworkId } = useNetwork();
  // React.useEffect(() => {

  // }, [])
  // (useState < string) | (undefined > ethereum.selectedAddress);

  React.useEffect(() => {
    if (!ethereum) return false;

    const handleAccountChange = ([newAddress]) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return setSelectedAddress();
      }

      console.log("accountsChanged: ", newAddress);
      setSelectedAddress(newAddress);
    };

    // We reinitialize it whenever the user changes their account.
    ethereum.on("accountsChanged", handleAccountChange);

    const handleNetworkChange = ([networkId]) => {
      setSelectedAddress();
      setCurrentNetworkId(networkId);
    };

    // We reset the dapp state if the network is changed
    ethereum.on("networkChanged", handleNetworkChange);

    return () => {
      if (handleAccountChange) {
        ethereum.removeListener("accountsChanged", handleAccountChange);
      }

      if (handleAccountChange) {
        ethereum.removeListener("networkChanged", handleNetworkChange);
      }
    };
  }, []);

  return { selectedAddress, setSelectedAddress };
};
