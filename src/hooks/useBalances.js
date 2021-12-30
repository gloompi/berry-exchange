import { useEffect } from 'react';

import { ETHER } from "../constants";
import { formatBalance } from "../helpers/convertors";
import useAppState, { ACTIONS } from "./useAppState";
import useWeb3 from "./useWeb3";

export default () => {
  const web3 = useWeb3();
  const {
    state: {
      account,
      exchangeContract,
      tokenContract,
      etherBalance,
      tokenBalance,
      exchangeEtherBalance,
      exchangeTokenBalance,
    },
    dispatch,
  } = useAppState();

  const fetchBalances = async () => {
    if (typeof account !== 'undefined') {
      const [
        etherBalance,
        tokenBalance,
        exchangeEtherBalance,
        exchangeTokenBalance,
      ] = await Promise.all([
        web3.eth.getBalance(account),
        tokenContract.methods.balanceOf(account).call(),
        exchangeContract.methods.balanceOf(ETHER, account).call(),
        exchangeContract.methods.balanceOf(tokenContract.options.address, account).call(),
      ]);

      dispatch({
        type: ACTIONS.SET_BALANCES,
        payload: {
          etherBalance: formatBalance(etherBalance),
          tokenBalance: formatBalance(tokenBalance),
          exchangeEtherBalance: formatBalance(exchangeEtherBalance),
          exchangeTokenBalance: formatBalance(exchangeTokenBalance),
        },
      });
    } else {
      window.alert('Please login with MetaMask');
    }
  };

  useEffect(() => {
    if (tokenContract && exchangeContract) {
      fetchBalances();
    }
  }, [exchangeContract, tokenContract]);

  return {
    etherBalance,
    tokenBalance,
    exchangeEtherBalance,
    exchangeTokenBalance,
    fetchBalances,
  }
}
