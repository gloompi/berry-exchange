import { useState } from 'react';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Skeleton from "@mui/material/Skeleton";
import TableContainer from "@mui/material/TableContainer";

import useAppState from '../../hooks/useAppState';
import useBalances from '../../hooks/useBalances';
import useExchangeMethods from '../../hooks/useExchangeMethods';
import Item from '../Item';
import Label from '../Label';
import Tabs from '../Tabs';
import InputForm from './InputForm';

const Balance = () => {
  const [state, setState] = useState({
    ethDepositAmount: '',
    ethWithdrawAmount: '',
    tokenDepositAmount: '',
    tokenWithdrawAmount: '',
  });
  const { state: { isBalanceTransactionHappening, isFillTransactionHappening } } = useAppState();
  const { etherBalance, tokenBalance, exchangeTokenBalance, exchangeEtherBalance } = useBalances();
  const {
    depositEther,
    depositToken,
    withdrawEther,
    withdrawToken,
  } = useExchangeMethods();

  const isTransactionHappening = isBalanceTransactionHappening || isFillTransactionHappening;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setState({
      ...state,
      [name]: value >= 0 ? value : '',
    });
  };

  const handleDepositEther = () => {
    depositEther(state.ethDepositAmount);
    setState({
      ...state,
      ethDepositAmount: '',
    });
  };

  const handleDepositToken = () => {
    depositToken(state.tokenDepositAmount);
    setState({
      ...state,
      tokenDepositAmount: '',
    });
  };

  const handleWithdrawEther = () => {
    withdrawEther(state.ethWithdrawAmount);
    setState({
      ...state,
      ethWithdrawAmount: '',
    });
  };

  const handleWithdrawToken = () => {
    withdrawToken(state.tokenWithdrawAmount);
    setState({
      ...state,
      tokenWithdrawAmount: '',
    });
  };

  return (
    <Item style={{ height: '49%' }}>
      <Label>Balance</Label>
      <Tabs labels={['Deposit', 'Withdraw']} style={{ height: '100%' }}>
        <TableContainer component={Paper} style={{ height: 'calc(100% - 112px)' }}>
          <Table sx={{ maxWidth: '100%' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell>Wallet</TableCell>
                <TableCell>Exchange</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell>ETH</TableCell>
                <TableCell>{(etherBalance && !isTransactionHappening) ? etherBalance : <Skeleton/>}</TableCell>
                <TableCell>{exchangeEtherBalance && !isTransactionHappening ? exchangeEtherBalance : <Skeleton/>}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="3">
                  {!isTransactionHappening ? (
                    <InputForm
                      btnLabel="Deposit"
                      placeholder="ETH Amount"
                      name="ethDepositAmount"
                      value={state.ethDepositAmount}
                      disabled={!state.ethDepositAmount}
                      onChange={handleChange}
                      onSubmit={handleDepositEther}
                    />
                  ) : <Skeleton />}
                </TableCell>
              </TableRow>
              <TableRow sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell>BERRY</TableCell>
                <TableCell>{tokenBalance && !isTransactionHappening ? tokenBalance : <Skeleton/>}</TableCell>
                <TableCell>{exchangeTokenBalance && !isTransactionHappening ? exchangeTokenBalance : <Skeleton/>}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="3">
                  {!isTransactionHappening ? (
                    <InputForm
                      btnLabel="Deposit"
                      placeholder="BERRY Amount"
                      name="tokenDepositAmount"
                      value={state.tokenDepositAmount}
                      disabled={!state.tokenDepositAmount}
                      onChange={handleChange}
                      onSubmit={handleDepositToken}
                    />
                  ) : <Skeleton />}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <TableContainer component={Paper} style={{ height: 'calc(100% - 112px)' }}>
          <Table sx={{ maxWidth: '100%' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Token</TableCell>
                <TableCell>Wallet</TableCell>
                <TableCell>Exchange</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>ETH</TableCell>
                <TableCell>{etherBalance && !isTransactionHappening ? etherBalance : <Skeleton />}</TableCell>
                <TableCell>{exchangeEtherBalance && !isTransactionHappening ? exchangeEtherBalance : <Skeleton />}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="3">
                  {!isTransactionHappening ? (
                    <InputForm
                      btnLabel="Withdraw"
                      placeholder="ETH Amount"
                      name="ethWithdrawAmount"
                      value={state.ethWithdrawAmount}
                      disabled={!state.ethWithdrawAmount}
                      onChange={handleChange}
                      onSubmit={handleWithdrawEther}
                    />
                  ) : <Skeleton />}
                </TableCell>
              </TableRow>
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>BERRY</TableCell>
                <TableCell>{tokenBalance && !isTransactionHappening ? tokenBalance : <Skeleton />}</TableCell>
                <TableCell>{exchangeTokenBalance && !isTransactionHappening ? exchangeTokenBalance : <Skeleton />}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="3">
                  {!isTransactionHappening ? (
                    <InputForm
                      btnLabel="Withdraw"
                      placeholder="BERRY Amount"
                      name="tokenWithdrawAmount"
                      value={state.tokenWithdrawAmount}
                      disabled={!state.tokenWithdrawAmount}
                      onChange={handleChange}
                      onSubmit={handleWithdrawToken}
                    />
                  ) : <Skeleton />}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Tabs>
    </Item>
  );
}

export default Balance;
