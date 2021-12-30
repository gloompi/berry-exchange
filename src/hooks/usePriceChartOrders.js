import { useEffect } from 'react';

import useAppState, { ACTIONS } from "./useAppState";
import useFillOrders from "./useFillOrders";
import { buildGraphData } from "../helpers/decorateOrders";

export default () => {
  const { state: { priceChartOrders }, dispatch } = useAppState();
  const [filledOrders] = useFillOrders();

  useEffect(() => {
    if (filledOrders) {
      const lastPrice = filledOrders[0]?.tokenPrice ?? 0;
      const secondLastPrice = filledOrders[1]?.tokenPrice ?? 0;

      const priceChartOrders = {
        series: [{
          data: buildGraphData(filledOrders),
        }],
        lastPriceChange: (lastPrice >= secondLastPrice) ? '+' : '-',
        lastPrice,
      }

      dispatch({
        type: ACTIONS.SET_PRICE_CHART_ORDERS,
        payload: priceChartOrders,
      });
    }
  }, [filledOrders && filledOrders.length]);

  return priceChartOrders;
}
