import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import useActiveOrders from "./useActiveOrders";
import { decorateOpenOrder } from "../helpers/decorateOrders";

export default () => {
  const { state: { openOrders }, dispatch } = useAppState();
  const activeOrders = useActiveOrders();

  useEffect(() => {
    if (activeOrders) {
      const openOrders = activeOrders
        .map((order) => decorateOpenOrder(order))
        .reduce((acc, order) => {
          acc[order.orderType].push(order);
          return acc;
        }, { buy: [], sell: [] });

      openOrders.buy.sort((a, b) => a.tokenAmount - b.tokenAmount);
      openOrders.sell.sort((a, b) => b.tokenAmount - a.tokenAmount);

      dispatch({
        type: ACTIONS.SET_OPEN_ORDERS,
        payload: openOrders,
      });
    }
  }, [activeOrders && activeOrders.length]);

  return openOrders;
}
