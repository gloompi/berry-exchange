import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';

const InputForm = ({
  input1 = {},
  input2 = {},
  disabled,
  btnLabel,
  onChange,
  onSubmit,
 }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', width: '100%' }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        style={{ width: '100%' }}
        name={input1.name}
        type="number"
        placeholder={input1.placeholder}
        inputProps={{ 'aria-label': input1.placeholder }}
        value={input1.value}
        onChange={onChange}
      />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        style={{ width: '100%' }}
        name={input2.name}
        type="number"
        placeholder={input2.placeholder}
        inputProps={{ 'aria-label': input2.placeholder }}
        value={input2.value}
        onChange={onChange}
      />
      <Button type="submit" sx={{ p: '10px' }} aria-label={btnLabel} disabled={disabled} fullWidth>
        {btnLabel}
      </Button>
    </Paper>
  );
}

export default InputForm;
