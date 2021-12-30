import * as dayjs from 'dayjs';

import { ETHER } from '../constants';
import { ether, tokens } from "./convertors";

export const decorateOrder = (order) => {
  const isGivingEther = order.tokenGive === ETHER;
  const etherAmount = isGivingEther ? order.amountGive : order.amountGet;
  const tokenAmount = isGivingEther ? order.amountGet : order.amountGive;
  const precision = 100000;

  return {
    ...order,
    etherAmount: ether(etherAmount),
    tokenAmount: tokens(tokenAmount),
    tokenPrice: Math.round((etherAmount / tokenAmount) * precision) / precision,
    formattedTimestamp: dayjs.unix(order.timestamp).format('h:mm:ss a M/D'),
  };
}

export const decorateFilledOrder = (order, prevOrder) => ({
  ...order,
  direction: (!prevOrder || order.tokenPrice > prevOrder.tokenPrice) ? 'success' : 'error',
});

export const decorateOpenOrder = (order) => {
  const orderType = order.tokenGive === ETHER ? 'buy' : 'sell';
  return  {
    ...order,
    orderTypeClass: orderType === 'buy' ? 'success' : 'error',
    orderFillAction: orderType === 'buy' ?  'sell' : 'buy',
    orderType,
  }
};

export const decorateMyFilledOrder = (order, account) => {
  const myOrder = order.user === account;
  const orderType = myOrder
    ? order.tokenGive === ETHER ? 'buy' : 'sell'
    : order.tokenGive === ETHER ? 'sell' : 'buy';

  return {
    ...order,
    orderType,
    orderTypeClass: orderType === 'buy' ? 'success' : 'error',
    orderSign: orderType === 'buy' ? '+' : '-',
  }
};

export const decorateMyOpenOrder = (order) => {
  const orderType = order.tokenGive === ETHER ? 'buy' : 'sell';

  return {
    ...order,
    orderType,
    orderTypeClass: (orderType === 'buy') ? 'success' : 'error',
  }
}

export const buildGraphData = (orders) => {
  const groupedOrders = orders.reduce((acc, order) => {
    const key = dayjs.unix(order.timestamp).startOf('hour').format();

    if (acc[key]) {
      acc[key] = [order, ...acc[key]];
    } else {
      acc[key] = [order];
    }

    return acc;
  }, {});

  return Object.keys(groupedOrders).map((hour) => {
    const orders = groupedOrders[hour];
    const open = orders[0];
    const close = orders[orders.length - 1];
    const high = Math.max(...orders.map(order => order.tokenPrice));
    const low = Math.min(...orders.map(order => order.tokenPrice));

    return {
      x: new Date(hour),
      y: [open.tokenPrice, high, low, close.tokenPrice],
    }
  });
}
