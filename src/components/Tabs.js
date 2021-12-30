import { Children, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    style={{ height: '100%' }}
    {...other}
  >
    {value === index && (
      children
    )}
  </div>
);

const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const Transactions = ({ children, labels = [], ...props }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box component="div" {...props}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {labels.map((label, idx) => (
            <Tab key={idx} label={label} {...a11yProps(idx)} />
          ))}
        </Tabs>
      </Box>
      {Children.map(children, (child, idx) => (
        <TabPanel value={value} key={idx} index={idx}>
          {child}
        </TabPanel>
      ))}
    </Box>
  );
};

export default Transactions;
