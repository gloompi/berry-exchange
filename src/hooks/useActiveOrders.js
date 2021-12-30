import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import useAllOrders from './useAllOrders';
import useCancelOrders from "./useCancelOrders";
import useFillOrders from "./useFillOrders";

export default () => {
  const { state: { activeOrders }, dispatch } = useAppState();
  const [allOrders] = useAllOrders();
  const [cancelledOrders] = useCancelOrders();
  const [filledOrders] = useFillOrders();

  useEffect(() => {
    if (allOrders && filledOrders && cancelledOrders) {
      const activeOrders = allOrders
        .filter((order) => (
          !filledOrders.some((o) => o.id === order.id)
          && !cancelledOrders.some((o) => o.id === order.id)
        ));

      dispatch({
        type: ACTIONS.SET_ACTIVE_ORDERS,
        payload: activeOrders,
      });
    }
  }, [
    allOrders && allOrders.length,
    cancelledOrders && cancelledOrders.length,
    filledOrders && filledOrders.length,
  ]);

  return activeOrders;
}
