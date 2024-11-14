import React, { useEffect, useState } from 'react';

import { Box, Typography, Paper, Grid, FormControl, FormControlLabel, Radio, RadioGroup, Button, CircularProgress } from '@mui/material';

interface Row {
  index: number;
  store: string;
  title: string;
  price: string;
  compared_price: number;
  compared_to: string;
  default_value: string;
}

const VerifyData = () => {
  const api = 'http://localhost:5000';
  console.log("Connecting to api @ ", api);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the filtered CSV data (this assumes you have an API endpoint providing it)
    fetch(api+'/verify/get-data')  // Adjust endpoint as needed
      .then((response) => response.json())
      .then((data) => {
        setRows(data);
        setLoading(false);  // Once rows are loaded, stop the loading spinner
      })
      .catch((error) => {
        alert('Sorry, we are unable to connect to the backend, please try again later.');
        console.error('Error fetching rows:', error);
        setLoading(false);
      });
  }, []);

  const handleVerificationSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Collect selected verification values from the form
    const verifiedItems = rows.map((row) => ({
      index: row.index,
      verification: row.default_value,  // Placeholder: You can modify this based on actual user input
    })).filter(item => item.verification === 'wrong');

    const verifiedIndexes = verifiedItems.map(item => item.index);

    // Submit verification data
    fetch(api+'/verify/update-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verifiedIndexes),
    })
      .then((response) => response.json())
      .then((result) => {
        // Redirect to results page after successful submission
        window.location.href = '/results';
      })
      .catch((error) => {
        alert('Sorry, we were unable to submit the verification. Please try again later.');
        console.error('Error submitting verification:', error);
      });
  };

  return (
    <Box>
      <Paper sx={{ padding: 4, maxWidth: "60%", margin: 'auto' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Verify Data ✅
        </Typography>
        <Typography variant="body1" gutterBottom>
          Results that come back as positive for "buy now" might be false positives, thus, with a simple view of the webshop, item name, price and target price, you can check whether or not this is correct. If they are wrong, submit the verification and they will be removed from the results.
        </Typography>
        <form onSubmit={handleVerificationSubmit}>
          <Box sx={{ mt: 3, mb: 2 }}>
            { (!loading && rows.length > 0) && (
              <Typography variant="h3" gutterBottom alignItems="center">
                Items to Verify
              </Typography>
            )}
            { loading && (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            )}
            { (!loading && rows.length > 0) && (
              <Grid container spacing={2}>
                {rows.map((row, index) => (
                  <Grid item xs={12} key={row.index}>
                    <Paper elevation={index % 2 === 0 ? 3 : 6} sx={{ p: 2 }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={12} sm={1}>
                          <Typography variant="subtitle2" sx={{ color: '#dea5ae' }}>Store</Typography>
                          <Typography variant="body1">{row.store}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Typography variant="subtitle2" sx={{ color: '#dea5ae' }}>Title</Typography>
                          <Typography variant="body1">{row.title}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={1}>
                          <Typography variant="subtitle2" sx={{ color: '#dea5ae' }}>Price</Typography>
                          <Typography variant="body1">{row.price}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={1}>
                          <Typography variant="subtitle2" sx={{ color: '#dea5ae' }}>Compared Price</Typography>
                          <Typography variant="body1">{row.compared_price}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Typography variant="subtitle2" sx={{ color: '#dea5ae' }}>Compared To</Typography>
                          <Typography variant="body1">{row.compared_to}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2}>
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              aria-label="verification"
                              name={`verification_${row.index}`}
                              defaultValue={row.default_value}
                              onChange={(e) => {
                                setRows((prevRows) =>
                                  prevRows.map((r) =>
                                    r.index === row.index ? { ...r, default_value: e.target.value } : r
                                  )
                                );
                              }}
                            >
                              <FormControlLabel value="correct" control={<Radio />} label="Correct" />
                              <FormControlLabel value="wrong" control={<Radio />} label="Wrong" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
            <Box mt={3} textAlign="center">
              { !loading && rows.length > 0 ? (
                <Button type="submit" variant="contained" color="primary">
                  Submit Verification
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={() => window.location.href = '/results'}>
                  Nothing to verify! View results!
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyData;