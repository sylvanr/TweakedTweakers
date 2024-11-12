// ScrapeForm.tsx
import React from 'react';
import {
  Typography,
  Box,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import './ScrapingForm.css';
import Items from '../../types/Items';
import Webshops from '../../types/Webshops';
import OptionSelector from './OptionSelector';
import CheckboxGroup from './CheckboxGroup';

interface ScrapeFormProps {
  handleSubmit: (event: React.FormEvent) => void;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => void;
  formValues: {
    scrape: string;
    sort: string;
    compare: string;
    price_track: string;
    test: string;
    selectedItems: string[];
    selectedWebshops: string[];
  };
  loading: boolean;
  webshops: Webshops;
  items: Items;
}

const ScrapeForm: React.FC<ScrapeFormProps> = ({ handleSubmit, handleChange, formValues, loading, webshops, items }) => {

  // Handle checkbox change for selected items
  const handleItemChange = (itemKey: string) => {
    const newSelectedItems = [...formValues.selectedItems];
    if (newSelectedItems.includes(itemKey)) {
      const index = newSelectedItems.indexOf(itemKey);
      if (index !== -1) {
        newSelectedItems.splice(index, 1);
      }
    } else {
      newSelectedItems.push(itemKey);
    }
    handleChange({ target: { name: 'selectedItems', value: newSelectedItems } } as any);
  };

  const clearSelectedItems = () => {
    handleChange({ target: { name: 'selectedItems', value: [] } } as any);
  };

  const handleWebshopChange = (webshopKey: string) => {
    const newSelectedWebshops = [...formValues.selectedWebshops];
    if (newSelectedWebshops.includes(webshopKey)) {
      const index = newSelectedWebshops.indexOf(webshopKey);
      if (index !== -1) {
        newSelectedWebshops.splice(index, 1);
      }
    } else {
      newSelectedWebshops.push(webshopKey);
    }
    handleChange({ target: { name: 'selectedWebshops', value: newSelectedWebshops } } as any);
  };

  const clearSelectedWebshops = () => {
    handleChange({ target: { name: 'selectedWebshops', value: [] } } as any);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2" gutterBottom>
        General options
      </Typography>
      <Box className="scrape-options">
        <Grid container spacing={2} alignItems="center">
          <OptionSelector title="Scrape" name="scrape" value={formValues.scrape} handleChange={handleChange} />
          <OptionSelector title="Sort" name="sort" value={formValues.sort} handleChange={handleChange} />
          <OptionSelector title="Compare" name="compare" value={formValues.compare} handleChange={handleChange} />
          <OptionSelector title="Price Track" name="price_track" value={formValues.price_track} handleChange={handleChange} />

          {/* Test Selection */}
          <Grid item xs={4}>
            <Typography variant="body1">Test</Typography>
          </Grid>
          <Grid item xs={8}>
            <FormControl fullWidth>
              <Select
                value={formValues.test}
                onChange={handleChange}
                name="test"
                displayEmpty
              >
                <MenuItem value="">
                  <em>None (Process all stores)</em>
                </MenuItem>
                {Object.keys(webshops).map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box className="scrape-btn-container">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || (formValues.selectedItems.length === 0 || formValues.selectedWebshops.length === 0)}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Start Scraping'}
              </Button>
            </Box>
          </Grid>

          <Grid container spacing={2}>
            <CheckboxGroup
              title="Items"
              items={Object.keys(items).filter(key => key !== "default")}
              selectedItems={formValues.selectedItems}
              onClear={clearSelectedItems}
              onChange={handleItemChange}
            />
            <CheckboxGroup
              title="Webshops"
              items={Object.keys(webshops).filter(key => key !== "default")}
              selectedItems={formValues.selectedWebshops}
              onClear={clearSelectedWebshops}
              onChange={handleWebshopChange}
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default ScrapeForm;
