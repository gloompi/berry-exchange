import Chart from 'react-apexcharts';
import { styled } from '@mui/material/styles';

import { chartOptions } from '../constants/priceChat.conf';
import usePriceChartOrders from '../hooks/usePriceChartOrders';
import Item from './Item';
import Label from './Label';

const Symbol = styled('span')`
  color: ${props => props.direction === 'success' ? props.theme.palette.success.main : props.theme.palette.error.main};
`;

const priceSymbol = (lastPriceChange)  => {
  if (lastPriceChange === '+') {
    return <Symbol direction="success">&#9650;</Symbol>;
  }
  return <Symbol direction="error">&#9660;</Symbol>;
}

const PriceChart = () => {
  const priceChartOrders = usePriceChartOrders();

  return (
    <Item style={{ height: '49%' }}>
      <Label>BERRY/ETH &nbsp; {priceSymbol(priceChartOrders?.lastPriceChange)} &nbsp; {priceChartOrders?.lastPrice}</Label>
      <div style={{ height: 'calc(100% - 64px)' }}>
        <Chart options={chartOptions} series={priceChartOrders?.series ?? []} type="candlestick" width="100%" height="100%" />
      </div>
    </Item>
  );
}

export default PriceChart;
