import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import { decorateOrder } from "../helpers/decorateOrders";

export default () =>  {
  const {
    state: { allOrders, exchangeContract } = {},
    dispatch,
  } = useAppState();

  const fetchAllOrders = async () => {
    const orderStream = await exchangeContract.getPastEvents('Order', { fromBlock: 0, toBlock: 'latest' });

    const allOrders = orderStream.map((event) => decorateOrder(event.returnValues));

    dispatch({
      type: ACTIONS.SET_ALL_ORDERS,
      payload: allOrders,
    })
  };

  useEffect(() => {
    if (exchangeContract) {
      fetchAllOrders();
    }
  }, [exchangeContract]);

  return [
    allOrders,
    fetchAllOrders,
  ];
};
