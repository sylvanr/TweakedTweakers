import React from 'react';
import {
  Paper,
  Typography,
  List
} from '@mui/material';

import './ScrapingInfo.css';
import ListItemComponent from './ListItemComponent';

const ScrapingInfo = () => (
  <Paper className="content-paper">
    <Typography variant="h3" component="h1" gutterBottom>
      Scrape 🕵️‍♂️
    </Typography>
    <Typography>
      This is where you can start scraping data from different websites. On this page, you can specify how to run the entire process. There are several options available.
    </Typography>

    {/* Introductory info in a list */}
    <List>
      <ListItemComponent
        title="Scrape"
        desc="Retrieve the latest prices for the selected items from the selected webshops. One reason to disable is to re-generate the charts."
      />
      <ListItemComponent
        title="Sort"
        desc="Sort the data by price."
      />
      <ListItemComponent
        title="Compare"
        desc="Ensure the search results are compared to an item in the list of selected items."
      />
      <ListItemComponent
        title="Price Track"
        desc="Update the complete list of retrieved prices, and generate the charts."
      />
      <ListItemComponent
        title="Test"
        desc="Select a test to run. If no test is selected, all selected stores and items are processed. If a store is selected, the first two items of the store are processed, and other stores are skipped."
      />
    </List>
  </Paper>
);

export default ScrapingInfo;
