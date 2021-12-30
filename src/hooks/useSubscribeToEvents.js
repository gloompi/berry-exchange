import { useEffect } from 'react';

import { decorateFilledOrder, decorateOrder } from "../helpers/decorateOrders";
import useAppState, { ACTIONS } from "./useAppState";
import useBalances from "./useBalances";

export default () => {
  const { state: { exchangeContract }, dispatch } = useAppState();
  const { fetchBalances } = useBalances();

  useEffect(() => {
    if (exchangeContract) {
      exchangeContract.events.Cancel({}, (_error, event) => {
        dispatch({
          type: ACTIONS.ADD_CANCEL_ORDER,
          payload: decorateOrder(event.returnValues),
        });
      });

      exchangeContract.events.Trade({}, (_error, event) => {
        dispatch({
          type: ACTIONS.ADD_FILL_ORDER,
          payload: decorateFilledOrder(decorateOrder(event.returnValues)),
        });
        fetchBalances();
      });

      exchangeContract.events.Deposit({}, async () => {
        await fetchBalances();
        dispatch({
          type: ACTIONS.SET_BALANCE_TRANSACTION_STATUS,
          payload: false,
        });
      });

      exchangeContract.events.Withdraw({}, async () => {
        await fetchBalances();
        dispatch({
          type: ACTIONS.SET_BALANCE_TRANSACTION_STATUS,
          payload: false,
        });
      });

      exchangeContract.events.Order({}, (_error, event) => {
        dispatch({
          type: ACTIONS.ADD_NEW_ORDER,
          payload: decorateOrder(event.returnValues),
        });
      });
    }
  }, [exchangeContract]);
}
