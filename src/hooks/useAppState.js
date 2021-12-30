import { createContext, useCallback, useContext, useReducer } from 'react';

export const ACTIONS = {
  ADD_CANCEL_ORDER: 'ADD_CANCEL_ORDER',
  ADD_FILL_ORDER: 'ADD_FILL_ORDER',
  ADD_NEW_ORDER: 'ADD_NEW_ORDER',
  INIT_STATE: 'INIT_STATE',
  SET_ORDERS: 'SET_ORDERS',
  SET_ALL_ORDERS: 'SET_ALL_ORDERS',
  SET_CANCEL_ORDERS: 'SET_CANCEL_ORDERS',
  SET_FILL_ORDERS: 'SET_FILL_ORDERS',
  SET_ACTIVE_ORDERS: 'SET_ACTIVE_ORDERS',
  SET_MY_FILLED_ORDERS: 'SET_MY_FILLED_ORDERS',
  SET_MY_OPEN_ORDERS: 'SET_MY_OPEN_ORDERS',
  SET_OPEN_ORDERS: 'SET_OPEN_ORDERS',
  SET_PRICE_CHART_ORDERS: 'SET_PRICE_CHART_ORDERS',
  SET_CANCEL_TRANSACTION_STATUS: 'SET_CANCEL_TRANSACTION_STATUS',
  SET_FILL_TRANSACTION_STATUS: 'SET_FILL_TRANSACTION_STATUS',
  SET_BALANCE_TRANSACTION_STATUS: 'SET_BALANCE_TRANSACTION_STATUS',
  SET_ORDER_TRANSACTION_STATUS: 'SET_ORDER_TRANSACTION_STATUS',
  SET_ETHER_BALANCE: 'SET_ETHER_BALANCE',
  SET_TOKEN_BALANCE: 'SET_TOKEN_BALANCE',
  SET_EXCHANGE_ETHER_BALANCE: 'SET_EXCHANGE_ETHER_BALANCE',
  SET_EXCHANGE_TOKEN_BALANCE: 'SET_EXCHANGE_TOKEN_BALANCE',
  SET_BALANCES: 'SET_BALANCES',
};

const defaultState = {
  account: null,
  allOrders: null,
  activeOrders: null,
  cancelledOrders: null,
  etherBalance: null,
  exchangeContract: null,
  exchangeEtherBalance: null,
  exchangeTokenBalance: null,
  filledOrders: null,
  myFilledOrders: null,
  myOpenOrders: null,
  openOrders: null,
  priceChartOrders: null,
  tokenBalance: null,
  tokenContract: null,
  isCancelTransactionHappening: false,
  isFillTransactionHappening: false,
  isBalanceTransactionHappening: false,
  isOrderTransactionHappening: false,
}

const reducer = (state = defaultState, action) => {
  const isNewOrderExists = (state.allOrders ?? []).findIndex(order => order.id === action.payload.id)
  const isFilledOrderExists = (state.filledOrders ?? []).findIndex(order => order.id === action.payload.id);

  switch (action.type) {
    case ACTIONS.INIT_STATE:
      return { ...state, ...action.payload };
    case ACTIONS.SET_ORDERS:
      return { ...state, ...action.payload };
    case ACTIONS.ADD_NEW_ORDER:
      return {
        ...state,
        isOrderTransactionHappening: false,
        allOrders: isNewOrderExists !== -1 ? state.allOrders : [...state.allOrders, action.payload],
      }
    case ACTIONS.SET_ALL_ORDERS:
      return { ...state, allOrders: action.payload };
    case ACTIONS.SET_CANCEL_ORDERS:
      return { ...state, cancelledOrders: action.payload };
    case ACTIONS.ADD_CANCEL_ORDER:
      return {
        ...state,
        isCancelTransactionHappening: false,
        cancelledOrders: [ ...state.cancelledOrders, action.payload],
      };
    case ACTIONS.SET_FILL_ORDERS:
      return { ...state, filledOrders: action.payload };
    case ACTIONS.ADD_FILL_ORDER:
      return {
        ...state,
        isFillTransactionHappening: false,
        filledOrders: isFilledOrderExists !== -1 ? state.filledOrders : [action.payload, ...state.filledOrders],
      }
    case ACTIONS.SET_ACTIVE_ORDERS:
      return { ...state, activeOrders: action.payload };
    case ACTIONS.SET_MY_FILLED_ORDERS:
      return { ...state, myFilledOrders: action.payload };
    case ACTIONS.SET_MY_OPEN_ORDERS:
      return { ...state, myOpenOrders: action.payload };
    case ACTIONS.SET_OPEN_ORDERS:
      return { ...state, openOrders: action.payload };
    case ACTIONS.SET_PRICE_CHART_ORDERS:
      return { ...state, priceChartOrders: action.payload };
    case ACTIONS.SET_CANCEL_TRANSACTION_STATUS:
      return { ...state, isCancelTransactionHappening: action.payload };
    case ACTIONS.SET_FILL_TRANSACTION_STATUS:
      return { ...state, isFillTransactionHappening: action.payload };
    case ACTIONS.SET_BALANCE_TRANSACTION_STATUS:
      return { ...state, isBalanceTransactionHappening: action.payload };
    case ACTIONS.SET_ORDER_TRANSACTION_STATUS:
      return { ...state, isOrderTransactionHappening: action.payload };
    case ACTIONS.SET_ETHER_BALANCE:
      return { ...state, etherBalance: action.payload };
    case ACTIONS.SET_TOKEN_BALANCE:
      return { ...state, tokenBalance: action.payload };
    case ACTIONS.SET_EXCHANGE_ETHER_BALANCE:
      return { ...state, exchangeEtherBalance: action.payload };
    case ACTIONS.SET_EXCHANGE_TOKEN_BALANCE:
      return { ...state, exchangeTokenBalance: action.payload };
    case ACTIONS.SET_BALANCES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AppStateContext = createContext({ state: defaultState, dispatch: () => {} });

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const memoDispatch = useCallback(dispatch, []);

  return (
    <AppStateContext.Provider value={{ state, dispatch: memoDispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export default () => {
  const value = useContext(AppStateContext);

  if (!value) {
    throw new Error('please define `AppStateProvider` higher in the tree');
  }

  return value;
}
