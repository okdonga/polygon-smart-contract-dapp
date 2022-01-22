import { weiToEtherAtFixedDecimal } from "./";

export const getContractData = async (_contract) => {
  const name = await _contract.name();
  const symbol = await _contract.symbol();

  return { name, symbol };
};

export const getTotalValueLocked = async (_contract, { unit }) => {
  const balance = await _contract.getTotalValueLocked();
  return weiToEtherAtFixedDecimal(balance, unit);
};

export const getDeposits = async (_contract) => {
  return await _contract.getAllUserInfo();
};

export const getWinningAmount = async (_contract) => {
  const amount = await _contract.winningAmount();
  return weiToEtherAtFixedDecimal(amount, 18);
};

export const deposit = async (_contract, { ipfs, weight, options }) => {
  return await _contract.deposit(ipfs, weight, options);
};

export const withdraw = async (_contract) => {
  return await _contract.withdraw();
};

export const withdrawAll = async (_contract) => {
  return await _contract.withdrawAll();
};

export const restart = async (_contract) => {
  return await _contract.restart();
};

export const submitResult = async (_contract, { ipfs, weight }) => {
  return await _contract.submitResult(ipfs, weight);
};

export const freezeFunds = async (_contract) => {
  return await _contract.freezeFunds();
};

export const releaseFunds = async (_contract) => {
  return await _contract.releaseFunds();
};
