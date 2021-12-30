import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import { decorateOrder } from "../helpers/decorateOrders";

export default () =>  {
  const {
    state: { cancelledOrders, exchangeContract } = {},
    dispatch,
  } = useAppState();

  const fetchCancelOrders = async () => {
    const cancelStream = await exchangeContract.getPastEvents('Cancel', { fromBlock: 0, toBlock: 'latest' });

    const cancelledOrders = cancelStream.map((event) => decorateOrder(event.returnValues));

    dispatch({
      type: ACTIONS.SET_CANCEL_ORDERS,
      payload: cancelledOrders,
    })
  };

  useEffect(() => {
    if (exchangeContract) {
      fetchCancelOrders();
    }
  }, [exchangeContract]);

  return [
    cancelledOrders,
    fetchCancelOrders,
  ];
};
