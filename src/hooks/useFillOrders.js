import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import { decorateFilledOrder, decorateOrder } from "../helpers/decorateOrders";

export default () =>  {
  const {
    state: { filledOrders, exchangeContract } = {},
    dispatch,
  } = useAppState();

  const fetchFillOrders = async () => {
    const tradeStream = await exchangeContract.getPastEvents('Trade', { fromBlock: 0, toBlock: 'latest' });

    let prevFilledOrder = null;

    const filledOrders = tradeStream
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((event) => {
        const order = decorateFilledOrder(decorateOrder(event.returnValues), prevFilledOrder);
        prevFilledOrder = order;

        return order;
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    dispatch({
      type: ACTIONS.SET_FILL_ORDERS,
      payload: filledOrders,
    })
  };

  useEffect(() => {
    if (exchangeContract) {
      fetchFillOrders();
    }
  }, [exchangeContract]);

  return [
    filledOrders,
    fetchFillOrders,
  ];
};
