// OptionSelector.tsx
import React from 'react';
import { Grid, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface OptionSelectorProps {
  title: string;
  name: string;
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ title, name, value, handleChange }) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={4}>
      <Typography variant="body1">{title}</Typography>
    </Grid>
    <Grid item xs={8}>
      <RadioGroup value={value} onChange={handleChange} name={name} row>
        <FormControlLabel value="true" control={<Radio />} label="Yes" />
        <FormControlLabel value="false" control={<Radio />} label="No" />
      </RadioGroup>
    </Grid>
  </Grid>
);

export default OptionSelector;
