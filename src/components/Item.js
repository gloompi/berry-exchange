import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

const Item = styled(Paper)`
  ${props => props.theme.typography.body2};
  text-align: center;
  color: ${props => props.theme.palette.text.secondary};
  height: 60px;
  width: 100%;
  line-height: 60px;
`;

export default Item;
