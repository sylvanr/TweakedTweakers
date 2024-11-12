import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface ProductEntry {
  store: string;
  url: string;
  title: string;
  price: number;
  "compared price": number;
  "compared to": string;
  buy: string;
  "discount (%)": number;
}

interface ResultsData {
  [model: string]: ProductEntry[];
}

const Results = () => {
  const api = 'http://localhost:5000';
  console.log("Connecting to api @ ", api);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCharts, setShowCharts] = useState(false);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [hideIncreasedPrices, setHideIncreasedPrices] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<ResultsData>({});

  useEffect(() => {
    // Fetch the filtered CSV data (this assumes you have an API endpoint providing it)
    fetch(api+'/results/get-data')
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        alert('Sorry, we are unable to connect to the backend, please try again later.');
        console.error('Error fetching rows:', error);
        setResults({});
      })
      .finally(() => setLoading(false));
  }, []);

  // Refs
  const modelRefs = useRef<{ [model: string]: HTMLHeadingElement | null }>({});
  // Scroll to the model's h2 element
  const handleScrollToModel = (model: string) => {
    const targetRef = modelRefs.current[model];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Memoize the applyFilters function with useCallback
  const applyFilters = useCallback(
    (data: ProductEntry[]) => {
      return data
        .filter((item) => !showBuyNow || item.buy === "yes")
        .filter((item) => searchText === '' || item.title.toLowerCase().includes(searchText.toLowerCase()))
        .filter((item) => !hideIncreasedPrices || item['discount (%)'] > 0); // Apply "hide increased prices" filter
    },
    [showBuyNow, searchText, hideIncreasedPrices] // Dependencies for applyFilters
  );

  const filteredResults = useMemo(() => {
    return Object.fromEntries(
      Object.entries(results).map(([model, data]) => {
        return [model, applyFilters(data)];
      })
    );
  }, [applyFilters, results]); // Dependencies for useMemo

  return (
    <Box display="flex">
      {/* Sidebar */}
      <Box sx={{ width: 250, mr: 2 }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h3" component="h1" gutterBottom>Filters</Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Show Buy Now */}
          <FormControlLabel
            control={<Checkbox checked={showBuyNow} onChange={() => setShowBuyNow(!showBuyNow)} />}
            label="Show BUY NOW only"
          />

          {/* Show/Hide Charts */}
          <FormControlLabel
            control={<Checkbox checked={showCharts} onChange={() => setShowCharts(!showCharts)} />}
            label="Show Charts"
          />

          {/* Show/Hide increased prices */}
          <FormControlLabel
            control={<Checkbox checked={hideIncreasedPrices} onChange={() => setHideIncreasedPrices(!hideIncreasedPrices)} />}
            label="Hide Increased Prices"
          />

          {/* Search Box */}
          <TextField
            label="Search Items"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchText('')} size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Reset Search Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setSearchText('');
              setHideIncreasedPrices(true);
              setShowBuyNow(false);
              setShowCharts(false);
            }}
          >
            Reset Filters
          </Button>
          <Divider sx={{ my: 2 }} />
          {/* Render Buttons for Each model */}
          {Object.entries(filteredResults).map(([model, data]) => {
            return data.length > 0 && (
              <Button
                onClick={() => handleScrollToModel(model)}
                key={model}
                variant="contained"
                fullWidth
                sx={{
                  color: '#dea5ae',
                  backgroundColor: '#4c1c2468',
                  mb: 1,
                  '&:hover': {
                    backgroundColor: '#4c1c2468',
                  },
                }}
              >
                {model}
              </Button>
            );
          })}
        </Paper>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        {/* Introduction */}
        <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>Results 📊</Typography>
        <Typography variant="h4" component="h2" gutterBottom>Introduction</Typography>
          <Typography>
            Use the sidebar filters to customize the results:
            <ul>
              <li><b>Show BUY NOW:</b> Only items within 10% of the "buy" price.</li>
              <li><b>Show Charts:</b> Toggle to display historical price charts.</li>
              <li><b>Search Items:</b> Filter results by item name.</li>
            </ul>
          </Typography>
        </Paper>

        {/* Results Section */}
        <Paper sx={{ p: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom>Results per item</Typography>
          <Divider sx={{ my: 2 }} />
          {loading ? (
            <Box display="flex" justifyContent="left" alignItems="left" height="100%">
              <CircularProgress size={48} />
            </Box>
          ) : (
            Object.entries(filteredResults).map(([model, data]) => {
              return data.length > 0 && (
                <Box key={model} mb={4}>
                  <Typography variant="h5" component="h2" gutterBottom ref={(el) => (modelRefs.current[model] = el)}>{model}</Typography>

                  <TableContainer component={Paper} elevation={3}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Store</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Target Price</TableCell>
                          <TableCell>Compared To</TableCell>
                          <TableCell>Buy</TableCell>
                          <TableCell>Discount (%)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.map((item) => (
                          <TableRow key={model + item.title + item.url + item.price}>
                            <TableCell>
                              <Link href={item.url} target="_blank" rel="noreferrer" style={{ color: '#dea5ae' }}>
                                {item.store}
                              </Link>
                            </TableCell>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item['compared price']}</TableCell>
                            <TableCell>{item['compared to']}</TableCell>
                            <TableCell>{item.buy}</TableCell>
                            <TableCell>
                              <DiscountCell discount={item['discount (%)']} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {showCharts && (
                    <Box mt={2}>
                      <img
                        src={`charts/${model}.png`}
                        alt={`${model} chart`}
                        style={{ width: 'auto', height: 'auto' }}
                      />
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                </Box>
              );
            })
          )}
        </Paper>
      </Box>
    </Box>
  );
};

interface DiscountCellProps {
  discount: number;
}

const DiscountCell: React.FC<DiscountCellProps> = ({ discount }) => {
  let color: string;

  if (discount > 20) color = '#00cc00';
  else if (discount >= 10) color = '#66ff66';
  else if (discount >= 0) color = '#ffff66';
  else if (discount >= -10) color = '#ffcccc';
  else if (discount >= -20) color = '#cc6666';
  else color = '#990000';

  return (
    <Typography style={{ color, fontWeight: discount > 0 ? 'bold' : 'normal' }}>
      {Math.round(discount)}%
    </Typography>
  );
};

export default Results;
