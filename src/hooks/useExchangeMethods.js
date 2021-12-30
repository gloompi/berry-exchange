import { useCallback } from 'react';

import { ETHER } from '../constants';
import useAppState, { ACTIONS } from './useAppState';
import useWeb3 from "./useWeb3";

const useExchangeMethods = () => {
  const web3 = useWeb3();
  const {
    state: {
      account,
      exchangeContract,
      tokenContract,
    } = {},
    dispatch,
  } = useAppState();

  const cancel = useCallback((orderId) => {
    exchangeContract.methods.cancelOrder(orderId).send({ from: account })
      .on('transactionHash', () => {
        dispatch({
          type: ACTIONS.SET_CANCEL_TRANSACTION_STATUS,
          payload: true,
        });
      })
      .on('error', (err) => {
        console.error(err);
        window.alert('Something went wrong');
      });
  }, [account, dispatch]);

  const fill = useCallback((orderId)  => {
    exchangeContract.methods.fillOrder(orderId).send({ from: account })
      .on('transactionHash', () => {
        dispatch({
          type: ACTIONS.SET_FILL_TRANSACTION_STATUS,
          payload: true,
        });
      })
      .on('error', (err) => {
        console.error(err);
        window.alert('Something went wrong');
      });
  }, [account, dispatch]);

  const depositEther = (amount) => {
    exchangeContract.methods.depositEther().send({ from: account,  value: web3.utils.toWei(amount, 'ether') })
      .on('transactionHash', () => {
        dispatch({
          type: ACTIONS.SET_BALANCE_TRANSACTION_STATUS,
          payload: true,
        });
      })
      .on('error',(error) => {
        console.error(error);
        window.alert(`There was an error!`);
      });
  };

  const withdrawEther = (amount) => {
    exchangeContract.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({ from: account })
      .on('transactionHash', () => {
        dispatch({
          type: ACTIONS.SET_BALANCE_TRANSACTION_STATUS,
          payload: true,
        });
      })
      .on('error',(error) => {
        console.error(error);
        window.alert(`There was an error!`);
      });
  };

  const depositToken = (amount) => {
    const weiAmount = web3.utils.toWei(amount, 'ether')

    tokenContract.methods.approve(exchangeContract.options.address, weiAmount).send({ from: account })
      .on('transactionHash', () => {
        exchangeContract.methods.depositToken(tokenContract.options.address, weiAmount).send({ from: account })
          .on('transactionHash', () => {
            dispatch({
              type: ACTIONS.SET_BALANCE_TRANSACTION_STATUS,
              payload: true,
            });
          })
          .on('error',(error) => {
            console.error(error);
            window.alert(`There was an error!`);
          })
      });
  };

  const withdrawToken = (amount) => {
    exchangeContract.methods.withdrawToken(tokenContract.options.address, web3.utils.toWei(amount, 'ether')).send({ from: account })
      .on('transactionHash', () => {
        dispatch({
          type: ACTIONS.SET_BALANCE_TRANSACTION_STATUS,
          payload: true,
        });
      })
      .on('error',(error) => {
        console.error(error);
        window.alert(`There was an error!`);
      });
  };

  const makeBuyOrder = (order) => {
    const tokenGet = tokenContract.options.address;
    const amountGet = web3.utils.toWei(order.amount, 'ether');
    const tokenGive = ETHER;
    const amountGive = web3.utils.toWei((order.amount * order.price).toString(), 'ether');

    exchangeContract.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
      .on('transactionHash', () => {
        dispatch({
          type: ACTIONS.SET_ORDER_TRANSACTION_STATUS,
          payload: true,
        });
      })
      .on('error',(error) => {
        console.error(error);
        window.alert(`There was an error!`);
      });
  };

  const makeSellOrder = (order) => {
    const tokenGet = ETHER;
    const amountGet = web3.utils.toWei((order.amount * order.price).toString(), 'ether');
    const tokenGive = tokenContract.options.address;
    const amountGive = web3.utils.toWei(order.amount, 'ether');

    exchangeContract.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
      .on('transactionHash', () => {
        dispatch({
          type: ACTIONS.SET_ORDER_TRANSACTION_STATUS,
          payload: true,
        });
      })
      .on('error',(error) => {
        console.error(error);
        window.alert(`There was an error!`);
      });
  };

  return {
    cancel,
    fill,
    depositEther,
    depositToken,
    withdrawEther,
    withdrawToken,
    makeBuyOrder,
    makeSellOrder,
  };
};

export default useExchangeMethods;
