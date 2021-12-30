import { DECIMALS } from "../constants";

export const ether = (wei) => {
  if (wei) {
    return (wei / DECIMALS);
  }
};

export const tokens = ether;

export const formatBalance = (balance) => {
  return ether(balance).toFixed(2);
}
