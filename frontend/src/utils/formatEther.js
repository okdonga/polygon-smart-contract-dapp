import { ethers } from "ethers";

export const weiToEther = (weiValue) => ethers.utils.formatEther(weiValue);
export const etherToWei = (etherValue) => ethers.utils.parseEther(etherValue);
export const weiToUnit = (weiValue, unit) =>
  ethers.utils.formatUnits(weiValue, unit);

export const weiToEtherAtFixedDecimal = (weiValue, decimal) =>
  Number(weiToEther(weiValue)).toFixed(decimal);
