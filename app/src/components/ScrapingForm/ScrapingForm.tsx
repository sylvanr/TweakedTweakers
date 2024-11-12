import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  SelectChangeEvent,
} from '@mui/material';

import './ScrapingForm.css';
import ScrapeForm from './ScrapeForm';
import Items from '../../types/Items';
import Webshops from '../../types/Webshops';

const ScrapingForm = () => {
  const api = 'http://localhost:5000';
  console.log("Connecting to api @ ", api);
  const [formValues, setFormValues] = useState({
    scrape: 'true',
    sort: 'true',
    compare: 'true',
    price_track: 'false',
    test: '',
    selectedItems: [],
    selectedWebshops: []
  });

  const [loading, setLoading] = useState(false);
  const [webshops, setWebshops] = useState<Webshops>({});
  const [items, setItems] = useState<Items>({});

  useEffect(() => {
    fetch(api+'/get-items')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setFormValues((prev: any) => ({
          ...prev,
          ["selectedItems"]: Object.keys(data).filter((key: string) => key !== "default"),
        }));
      })
      .catch((error) => {
        alert('Sorry, we are unable to connect to the backend, please try again later.');
        console.error('Error fetching rows:', error);
        setItems({});
      })
      .finally(() => {
        fetch(api+'/get-webshops')
          .then((response) => response.json())
          .then((data) => {
            setWebshops(data);
            setFormValues((prev: any) => ({
              ...prev,
              ["selectedWebshops"]: Object.keys(data).filter((key: string) => key !== "default"),
            }));
          })
          .catch((error) => {
            alert('Sorry, we are unable to connect to the backend, please try again later.');
            console.error('Error fetching rows:', error);
            setWebshops({});
          })
          .finally(() => {
            setLoading(false);
          });
      });
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3600000); // 1 hour

    // Prepare data payload
    const payload = {
      scrape: formValues.scrape === 'true',
      sort: formValues.sort === 'true',
      compare: formValues.compare === 'true',
      price_track: formValues.price_track === 'true',
      quick_test: false,
      scrape_items: formValues.test ? ["ddf484"] : formValues.selectedItems,
      scrape_webshops: formValues.test ? [formValues.test] : formValues.selectedWebshops,
    };

    try {
      // Send POST request to backend
      const response = await fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        alert("Sorry, we were unable to load the data. Please check if all services are running, and check the backend's main.log")
        throw new Error(`Server error: ${response.statusText}`);
      }

      // Parse and log response data
      const result = await response.json();
      if (result === "Completed") {
        if (formValues.price_track === 'true') {
          window.location.href = '/results';
        } else {
          window.location.href = '/verify';
        }
      }
      else {
        alert("Error: result was not completed, but " + result);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timed out and was aborted');
      } else {
        console.error('Error during form submission:', error);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false); // Reset loading state
    }
  };

  // Add elevation to the paper, to brighten up and identify important paper
  return (
    <Paper className="content-paper" elevation={3}>
      <Typography variant="h3" component="h1" gutterBottom>
        Trigger process 🚀
      </Typography>

      <ScrapeForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formValues={formValues}
        loading={loading}
        webshops={webshops}
        items={items} />
    </Paper>
  );
};

export default ScrapingForm;
