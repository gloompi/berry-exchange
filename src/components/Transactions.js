import { styled } from "@mui/material/styles";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Skeleton from "@mui/material/Skeleton";
import TableContainer from "@mui/material/TableContainer";

import useAppState from "../hooks/useAppState";
import useMyFilledOrders from '../hooks/useMyFilledOrders';
import useMyOpenOrders from '../hooks/useMyOpenOrders';
import useExchangeMethods from '../hooks/useExchangeMethods';
import Item from './Item';
import Label from './Label';
import Tabs from './Tabs';

const StyledTableCell = styled(TableCell)`
  color: ${props => props.type === 'success' ? props.theme.palette.success.main : props.theme.palette.error.main};
`;

const Transactions = () => {
  const { state: { isCancelTransactionHappening } } = useAppState();
  const { cancel } = useExchangeMethods();
  const myFilledOrders = useMyFilledOrders();
  const myOpenOrders = useMyOpenOrders();

  const handleCancelClick = (orderId) => () => {
    cancel(orderId);
  };

  const Loader = (
    Array.from({ length: 3 }).map((_, idx) => (
      <TableRow key={idx}>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
        <TableCell><Skeleton /></TableCell>
      </TableRow>
    ))
  )

  return (
    <Item style={{ height: '49%' }}>
      <Label>Transactions</Label>
      <Box sx={{ width: '100%', height: 'calc(100% - 120px)' }}>
        <Tabs labels={['Trades', 'Orders']} style={{ height: '100%' }}>
          <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto' }}>
            <Table sx={{ maxWidth: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>TIME</TableCell>
                  <TableCell>BERRY</TableCell>
                  <TableCell>BERRY/ETH</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myFilledOrders ? myFilledOrders.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.formattedTimestamp}
                    </TableCell>
                    <StyledTableCell type={row.orderTypeClass}>{row.orderSign}{row.tokenAmount}</StyledTableCell>
                    <StyledTableCell type={row.orderTypeClass}>{row.tokenPrice}</StyledTableCell>
                  </TableRow>
                )) : Loader}
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer component={Paper} style={{ height: '100%', overflowY: 'auto' }}>
            <Table sx={{ maxWidth: '100%' }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>BERRY/ETH</TableCell>
                  <TableCell>CANCEL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(myOpenOrders && !isCancelTransactionHappening) ? myOpenOrders.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <StyledTableCell type={row.orderTypeClass}>{row.tokenAmount}</StyledTableCell>
                    <StyledTableCell type={row.orderTypeClass}>{row.tokenPrice}</StyledTableCell>
                    <TableCell>
                      <Button onClick={handleCancelClick(row.id)}>X</Button>
                    </TableCell>
                  </TableRow>
                )) : Loader}
              </TableBody>
            </Table>
          </TableContainer>
        </Tabs>
      </Box>
    </Item>
  );
};

export default Transactions;
