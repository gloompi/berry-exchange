import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import useFillOrders from "./useFillOrders";
import { decorateMyFilledOrder } from "../helpers/decorateOrders";

export default () => {
  const { state: { account, myFilledOrders }, dispatch } = useAppState();
  const [filledOrders] = useFillOrders();

  useEffect(() => {
    if (filledOrders) {
      const myFilledOrders = filledOrders
        .filter((o) => o.user === account || o.userFill === account)
        .map((order) => decorateMyFilledOrder(order, account));

      dispatch({
        type: ACTIONS.SET_MY_FILLED_ORDERS,
        payload: myFilledOrders,
      });
    }
  }, [filledOrders && filledOrders.length]);

  return myFilledOrders;
}
