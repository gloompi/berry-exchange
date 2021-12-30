import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Skeleton from '@mui/material/Skeleton';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import useAppState from '../hooks/useAppState';
import useOpenOrders from '../hooks/useOpenOrders';
import useExchangeMethods from '../hooks/useExchangeMethods';
import Item from './Item'
import Label from './Label'

const StyledTableCell = styled(TableCell)`
  color: ${props => props.type === 'success' ? props.theme.palette.success.main : props.theme.palette.error.main};
`;

const OrderBook = () => {
  const { fill } = useExchangeMethods();
  const { state: { isFillTransactionHappening } } = useAppState();
  const openOrders = useOpenOrders();
  const buyOrders = openOrders?.buy || [];
  const sellOrders = openOrders?.sell || [];

  const handleClick = (orderId) => () => {
    fill(orderId);
  }

  const Loader = (
    Array.from({ length: 3 }).map((_, idx) => (
      <TableRow key={idx}>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Item style={{ height: '100%' }}>
      <Label>OrderBook</Label>
      <TableContainer component={Paper} style={{ height: 'calc(100% - 63px)', overflowY: 'auto' }}>
        <Table sx={{ maxWidth: '100%' }} aria-label="simple table">
          <TableBody>
            {(openOrders && !isFillTransactionHappening) ? buyOrders.map((row) => (
              <Tooltip key={row.id} title={`Click to ${row.orderFillAction}`}>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  style={{ cursor: 'pointer' }}
                  onClick={handleClick(row.id)}
                >
                  <TableCell>{row.tokenAmount}</TableCell>
                  <StyledTableCell type={row.orderTypeClass}>{row.tokenPrice}</StyledTableCell>
                  <TableCell>{row.etherAmount}</TableCell>
                </TableRow>
              </Tooltip>
            )) : Loader}
            <TableRow>
              <TableCell>BERRY</TableCell>
              <TableCell>BERRY/ETH</TableCell>
              <TableCell>ETH</TableCell>
            </TableRow>
            {(openOrders && !isFillTransactionHappening) ? sellOrders.map((row) => (
              <Tooltip key={row.id} title={`Click to ${row.orderFillAction}`}>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  style={{ cursor: 'pointer' }}
                  onClick={handleClick(row.id)}
                >
                  <TableCell>{row.tokenAmount}</TableCell>
                  <StyledTableCell type={row.orderTypeClass}>{row.tokenPrice}</StyledTableCell>
                  <TableCell>{row.etherAmount}</TableCell>
                </TableRow>
              </Tooltip>
            )) : Loader}
          </TableBody>
        </Table>
      </TableContainer>
    </Item>
  );
}

export default OrderBook;
