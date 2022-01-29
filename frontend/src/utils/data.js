import { weiToEther } from "./";

export const transformUserData = (userData) => {
  const {
    owner,
    goal: { weight: currentWeight, ipfsHash: goalIpfsHash },
    actual: { weight: actualWeight, ipfsHash: acutalIpfsHash },
    valueLocked,
    reached,
  } = userData;
  return {
    address: owner,
    goal: {
      weight: gramsToKilos(currentWeight.toNumber()), // grams
      ipfs: goalIpfsHash,
    },
    actual: {
      weight: gramsToKilos(actualWeight.toNumber()), // grams
      ipfs: acutalIpfsHash,
    },
    valueLocked: weiToEther(valueLocked), // wei -> ether
    reached,
  };
};

export const gramsToKilos = (gramsValue) => {
  return (gramsValue / 1000).toFixed(2);
};

export const kilosToGrams = (kilosValue) => {
  return parseInt(kilosValue * 1000);
};

export const isTheSameAddress = (selectedAddress) => {
  return (item) =>
    item?.address?.toLowerCase() === selectedAddress.toLowerCase();
};

export const trimAddress = (address) => {
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};
