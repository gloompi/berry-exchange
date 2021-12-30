import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

import useFillOrders from '../hooks/useFillOrders';
import Item from './Item';
import Label from './Label';

const StyledTableCell = styled(TableCell)`
  color: ${props => props.direction === 'success' ? props.theme.palette.success.main : props.theme.palette.error.main};
`;

const History = () => {
  const [filledOrders] = useFillOrders();

  return (
    <Item style={{ height: '100%' }}>
      <Label>History</Label>
      <TableContainer component={Paper} style={{ height: 'calc(100% - 64px)', overflowY: 'auto' }}>
        <Table sx={{ maxWidth: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell align="right">BERRY</TableCell>
              <TableCell align="right">BERRY/ETH</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filledOrders ? filledOrders.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.formattedTimestamp}
                </TableCell>
                <TableCell align="right">{row.tokenAmount}</TableCell>
                <StyledTableCell align="right" direction={row.direction}>{row.tokenPrice}</StyledTableCell>
              </TableRow>
            )) : (
              Array.from({ length: 3 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell component="th" scope="row"><Skeleton width={105} height={40} /></TableCell>
                  <TableCell align="right"><Skeleton /></TableCell>
                  <StyledTableCell align="right" direction="success"><Skeleton /></StyledTableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Item>
  );
};

export default History;
