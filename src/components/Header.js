import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import useAppState from '../hooks/useAppState';

const HeaderBox = styled(Box)`
  background: ${props => props.theme.palette.secondary.main};
`;

const Header = () => {
  const { state: { account } = {} } = useAppState();

  return (
    <HeaderBox sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            disabled
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Berry Exchange
          </Typography>
            <Button
              href={account ? `https://etherscan.io/address/${account}` : 'https://metamask.io/'}
              color="inherit"
              target="_blank"
            >
              {account ? account : 'please login with `MetaMask`'}
            </Button>
        </Toolbar>
      </AppBar>
    </HeaderBox>
  );
}

export default Header;
