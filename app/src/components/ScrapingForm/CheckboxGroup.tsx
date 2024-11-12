// CheckboxGroup.tsx
import React, { useState } from 'react';
import { Typography, FormGroup, Checkbox, Grid, TextField, InputAdornment, IconButton } from '@mui/material';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import ClearIcon from '@mui/icons-material/Clear';

interface CheckboxGroupProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onClear: () => void;
  onChange: (itemKey: string) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, items, selectedItems, onClear, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on the search term
  const filteredItems = items.filter(itemKey =>
    itemKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Grid item xs={12} sm={6}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
        <Typography
          variant="body2"
          color="secondary"
          style={{ cursor: 'pointer', marginTop: '10px' }}
          onClick={onClear}
        >
          (Deselect All)
        </Typography>
      </Typography>

      {/* Search Field with Clear Button */}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search items"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        style={{ marginBottom: '10px' }}
        InputProps={{
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} size="small">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Filtered Items List */}
      <FormGroup>
        {filteredItems.map((itemKey) => (
          <MuiFormControlLabel
            key={itemKey}
            control={
              <Checkbox
                checked={selectedItems.includes(itemKey)}
                onChange={() => onChange(itemKey)}
                color={'secondary'}
              />
            }
            label={itemKey}
          />
        ))}
      </FormGroup>
    </Grid>
  );
};

export default CheckboxGroup;
