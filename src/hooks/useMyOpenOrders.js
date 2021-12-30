import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import useActiveOrders from "./useActiveOrders";
import { decorateMyOpenOrder } from "../helpers/decorateOrders";

export default () => {
  const { state: { account, myOpenOrders }, dispatch } = useAppState();
  const activeOrders = useActiveOrders();

  useEffect(() => {
    if (activeOrders) {
      const myOpenOrders = activeOrders
        .filter((o) => o.user === account)
        .map((order) => decorateMyOpenOrder(order))
        .sort((a, b) => b.timestamp - a.timestamp);

      dispatch({
        type: ACTIONS.SET_MY_OPEN_ORDERS,
        payload: myOpenOrders,
      });
    }
  }, [activeOrders && activeOrders.length]);

  return myOpenOrders;
}
