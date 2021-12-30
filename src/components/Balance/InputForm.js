import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';

const InputForm = ({
  btnLabel,
  placeholder,
  name,
  value,
  disabled,
  onSubmit,
  onChange,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
      onSubmit={handleSubmit}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        name={name}
        type="number"
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={value}
        onChange={onChange}
      />
      <Button type="submit" sx={{ p: '10px' }} aria-label={btnLabel} disabled={disabled}>
        {btnLabel}
      </Button>
    </Paper>
  );
}

export default InputForm;
