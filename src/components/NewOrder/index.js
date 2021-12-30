import { useState } from 'react';
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";

import useAppState from '../../hooks/useAppState';
import useExchangeMethods from '../../hooks/useExchangeMethods';
import Item from '../Item';
import Label from '../Label';
import Tabs from '../Tabs';
import InputForm from "./InputForm";

const Index = () => {
  const [state, setState] = useState({
    buyOrderAmount: '',
    buyOrderPrice: '',
    sellOrderAmount: '',
    sellOrderPrice: '',
  });
  const { state: { isOrderTransactionHappening } } = useAppState();
  const { makeBuyOrder, makeSellOrder } = useExchangeMethods();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value >= 0 ? value : '',
    });
  };

  const handleBuyOrder = (e) => {
    e.preventDefault();

    makeBuyOrder({
      amount: state.buyOrderAmount,
      price: state.buyOrderPrice,
    });

    setState((state) => ({
      ...state,
      buyOrderAmount: '',
      buyOrderPrice: '',
    }));
  };

  const handleSellOrder = (e) => {
    e.preventDefault();

    makeSellOrder({
      amount: state.sellOrderAmount,
      price: state.sellOrderPrice,
    });

    setState((state) => ({
      ...state,
      sellOrderAmount: '',
      sellOrderPrice: '',
    }));
  };

  return (
    <Item style={{ height: '49%' }}>
      <Label>NewOrder</Label>
      <Tabs labels={['Buy', 'Sell']} style={{ height: 'calc(100% - 112px)' }}>
        <TableContainer component={Paper} style={{ height: '100%' }}>
          {!isOrderTransactionHappening ? (
            <InputForm
              btnLabel="Buy"
              input1={{
                name: 'buyOrderAmount',
                placeholder: 'Buy Amount',
                value: state.buyOrderAmount,
              }}
              input2={{
                name: 'buyOrderPrice',
                placeholder: 'Buy Price',
                value: state.buyOrderPrice,
              }}
              disabled={state.buyOrderAmount === '' || state.buyOrderPrice === ''}
              onChange={handleChange}
              onSubmit={handleBuyOrder}
            />
          ) : (
            <Skeleton variant="rect" />
          )}
          { (state.buyOrderAmount && state.buyOrderPrice) ? <small>Total: {(state.buyOrderAmount * state.buyOrderPrice).toFixed(2)} ETH</small> : null }
        </TableContainer>
        <TableContainer component={Paper} style={{ height: '100%' }}>
          {!isOrderTransactionHappening ? (
            <InputForm
              btnLabel="Sell"
              input1={{
                name: 'sellOrderAmount',
                placeholder: 'Sell Amount',
                value: state.sellOrderAmount,
              }}
              input2={{
                name: 'sellOrderPrice',
                placeholder: 'Sell Price',
                value: state.sellOrderPrice,
              }}
              disabled={state.sellOrderAmount === '' || state.sellOrderPrice === ''}
              onChange={handleChange}
              onSubmit={handleSellOrder}
            />
          ) : (
            <Skeleton variant="rect" />
          )}
          { (state.sellOrderAmount && state.sellOrderPrice) ? <small>Total: {(state.sellOrderAmount * state.sellOrderPrice).toFixed(2)} ETH</small> : null }
        </TableContainer>
      </Tabs>
    </Item>
  );
};

export default Index;
