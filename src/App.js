import { useEffect } from 'react';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

import './App.css';

import useAppState, { ACTIONS } from './hooks/useAppState';
import useSubscribeToEvents from './hooks/useSubscribeToEvents';
import useWeb3 from './hooks/useWeb3';
import Header from './components/Header';
import Balance from './components/Balance';
import Index from './components/NewOrder';
import OrderBook from './components/OrderBook';
import PriceChart from './components/PriceChart';
import Transactions from './components/Transactions';
import History from './components/History';
import Exchange from './abis/Exchange.json';
import Token from './abis/Token.json';

const Container = styled(Grid)`
  margin: 0 -8px;
  padding: 15px;
  height: calc(100vh - 64px);
  background: ${props => props.theme.palette.background.paper};
  
  ${props => props.theme.breakpoints.down('md')} {
    height: 100%;
  }
`

const Column = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const App = () => {
  useSubscribeToEvents();

  const web3 = useWeb3();
  const { dispatch } = useAppState();

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  useEffect(() => {
    const init = async () => {
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const exchangeAddress = Exchange.networks[networkId]?.address;
      const exchangeContract = exchangeAddress ? new web3.eth.Contract(Exchange.abi, exchangeAddress) : null;
      const tokenAddress = Token.networks[networkId]?.address;
      const tokenContract = tokenAddress ? new web3.eth.Contract(Token.abi, tokenAddress) : null;

      dispatch({
        type: ACTIONS.INIT_STATE,
        payload: { account: accounts[0], exchangeContract, tokenContract },
      });
    };

    if (web3) {
      init();
    }
  }, [web3]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <Container container spacing={1}>
          <Column item md={2.4} xs={12}>
            <Balance />
            <Index />
          </Column>
          <Column item md={2.4} xs={12}>
            <OrderBook />
          </Column>
          <Column item md={4.8} xs={12}>
            <PriceChart />
            <Transactions />
          </Column>
          <Column item md={2.4} xs={12}>
            <History />
          </Column>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
