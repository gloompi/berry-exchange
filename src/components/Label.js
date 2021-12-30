import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Label = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  height: 48,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 15,
}));

export default Label;
