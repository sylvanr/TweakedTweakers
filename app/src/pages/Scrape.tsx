import React from 'react';
import { Box } from '@mui/material';
import './Scrape.css';  // Import the corresponding CSS file
import ScrapingForm from '../components/ScrapingForm/ScrapingForm';  // Your scraping form component
import ScrapingInfo from '../components/ScrapingInfo';

const Scrape = () => {
  return (
    <Box>
      <ScrapingInfo />
      <ScrapingForm />
    </Box>
  );
};

export default Scrape;
