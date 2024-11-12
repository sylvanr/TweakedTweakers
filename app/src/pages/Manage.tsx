import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Tabs, Tab, Divider, List, ListItem, Collapse, IconButton } from '@mui/material';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import StoreFrontIcon from '@mui/icons-material/Storefront';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Webshops from '../types/Webshops';
import Items from '../types/Items';

import ManageTab from '../components/ManageTab';

const Manage = () => {
  const api = 'http://localhost:5000';
  console.log("Connecting to api @ ", api);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Items>({});
  const [webshops, setWebshops] = useState<Webshops>({});

  const [showItemsDetails, setShowItemsDetails] = useState(false);
  const [showWebshopsDetails, setShowWebshopsDetails] = useState(false);

  useEffect(() => {
    fetch(api+'/get-items')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Paper className="content-paper">
        <Typography variant="h3" component="h1" gutterBottom>
          Manage 🛠
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Introduction
        </Typography>
        <Typography>
          This page allows you to manage the items and webshops that are used in the scraping process.<br />
          Select the tab for Items or for Webshops, and hit edit, delete, or create a new one.<br />
          <br />
          Expand the Items or Webshops sections below for more information on the required properties.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          Items
          <IconButton onClick={() => setShowItemsDetails(!showItemsDetails)} color="secondary">
            {showItemsDetails ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Typography>
        <Collapse in={showItemsDetails}>
          <Typography>
            Items are what we are looking for in the webshops. These are the properties where * is required:
            <List sx={{ padding: 0 }}>
              <ListItem sx={{ padding: '4px 0' }}><b>• name*: </b> The name.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• description: </b> A description.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• target_price: </b> The target price, this is automatically calculated based on the base_price and the target_discount_percentage.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• target_discount_percentage*: </b> The target discount percentage, set to 20 (%) by default but can be changed to whatever discount you are looking for.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• base_price*: </b> The "base price", meaning the lowest or average price against which you want to compare "on sale" items.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• brand: </b> The brand name.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• main_category*: </b> The main category.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• subcategories: </b> Other categories to describe the item. Separate multiple items by a comma (for example: Drugs,Alcohol)</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• bought*: </b> Whether the item has been bought or not, this makes sure the item does not show up as "buy now" in the results and verify page.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}><b>• search_term: </b> The search term used to find the item in the webshops. Usually, this is the same as the name, but in some webshops, some items can only be found when searching for a specific term.</ListItem>
            </List>
          </Typography>
        </Collapse>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          Webshops
          <IconButton onClick={() => setShowWebshopsDetails(!showWebshopsDetails)} color="secondary">
            {showWebshopsDetails ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Typography>
        <Collapse in={showWebshopsDetails}>
          <Typography>
            Webshops are the pages we look through to find the selected items. These are the properties where * is required:
          </Typography>
          <List sx={{ padding: 0 }}>
            <ListItem sx={{ padding: '4px 0' }}>• name*: The name of the webshop.</ListItem>
            <ListItem sx={{ padding: '4px 0' }}>• query_url*: The URL used to query the webshop, with INPUT as a placeholder for the search term. You can usually find this in your address bar after searching. For example, after searching for "DDF484" on `amazon.com`, you can find your search term in the address bar under `https://www.amazon.com/s?k=ddf484&crid=ZU2TNRZEFGVV&sprefix=ddf484%2Caps%2C218&ref=nb_sb_noss_2`. Stripping the address leads to `https://www.amazon.com/s?k=ddf484`. Then, replacing the search term with INPUT, resulting in `https://www.amazon.com/s?k=INPUT`</ListItem>
            <ListItem sx={{ padding: '4px 0' }}>• main_category*: The main category of items the webshop sells.</ListItem>
            <ListItem sx={{ padding: '4px 0' }}>• subcategories: Other categories to describe the webshop.</ListItem>
            <ListItem sx={{ padding: '4px 0' }}>• selectors*: The CSS selectors used to scrape the webshop. These include:</ListItem>
            <List sx={{ paddingLeft: 4 }}>
              <ListItem sx={{ padding: '4px 0' }}>• product_container*: The CSS selector for the product container.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}>• url*: The CSS selector for the product URL.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}>• title*: The CSS selector for the product title.</ListItem>
              <ListItem sx={{ padding: '4px 0' }}>• price*: The CSS selector for the product price.</ListItem>
            </List>
          </List>
          <Typography>
            These selectors can be found by right-clicking on the item you want to scrape and selecting "Inspect" in your browser.<br />
            The selectors etcetera usually cannot be used unfortunately, due to the generation of items, rather than hardcoding.<br />
            We need to look for specific patterns in the `elements` tab of the `inspect` window.<br />
            <br />
            Taking one of the implemented webshops as an example:<br />
            `https://mastertools.nl/?q=ddf484#twn|?tn_q=ddf484`<br />
            is the query URL, where `ddf484` is the search term.<br />
            <br />
            For all of the following, we can check other search results on the same page and see that they have the same value, to verify these are correct selectors for this case.<br />
            There is a product container which we can find by its class: `.twn-starter__products-item`.<br />
            The URL is found by the `a.twn-product-tile` class. In this case, it is prefixed with `a`, as it is an `a href` element, and the redirect uri can be retrieved from it. Note that this redirect can either contain the website tag, or only the route of the website, either option works with the implemented scraper.<br />
            The title is found by the `.twn-product-tile__title a` selector, we add ` a` to the end, because it is in the first `a` child element of the selector.<br />
            The price is found by the `.twn-product-tile__price` selector. Sometimes the price can be placed in complex substructures, like bol.com might have their price base value as a child, and another child which can be a span, or a sup, with the price fraction. For this purpose, the general parent should be used, as the scraper uses a regular expression to extract the price as best as possible.<br />
            <br />
            <i>I usually try to find the selector, and verify with two or three search queries.</i><br />
            <br />
            <b>A lifehack that I started using later on was: Providing the content of `./data/webshops.json` to ChatGPT, then right-click, copy expanded, Copy outerHTML, and ask the following prompt: "Based on the selectors in the JSON data above, which JSON selectors should I use for the following HTML: `paste the outerHTML`. This usually gives either the complete selectors, or at least gives you a good idea of where to look.</b>
          </Typography>
        </Collapse>
      </Paper>

      <Paper className="content-paper" elevation={3} sx={{ position: 'relative', paddingTop: 4 }}>
        {/* Tab Buttons */}
        <Tabs value={activeTab} onChange={handleChange} aria-label="icon tabs" centered>
          <Tab icon={<StoreFrontIcon />} label="Items" />
          <Tab icon={<LocalGroceryStoreIcon />} label="Webshops" />
        </Tabs>
        {/* Content */}
        {loading && (
          // <Paper className="content-paper" elevation={3}>
          <CircularProgress size={48} />
          // </Paper>
        )}
        {!loading && activeTab === 0 && <ManageTab variant="Items" elements={items} />}
        {!loading && activeTab === 1 && <ManageTab variant="Webshops" elements={webshops} />}
      </Paper>
    </Box>
  );
};

export default Manage;
