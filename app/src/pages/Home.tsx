import React from 'react';
import { Box, Typography, List, Paper } from '@mui/material';
import ListItemLink from '../components/ListItemLink';
import './Home.css';

const Home = () => (
  <Box>
    <Paper className="content-paper">
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to TweakedTweakers 😬
      </Typography>
      <Typography className="home-description">
        This application allows you to scrape data from various websites, compare the data to find the best prices, and more.
        Below are the key pages you can explore:
      </Typography>
      <List className="home-list" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ListItemLink to="/" primaryText="Home" secondaryText="You are currently here! 🙃" />
        <ListItemLink to="/manage" primaryText="Manage" secondaryText="Manage the items and the webshops." />
        <ListItemLink to="/scrape" primaryText="Scrape" secondaryText="Start scraping data from different websites, and specify the scraping process." />
        <ListItemLink to="/verify" primaryText="Verify Data" secondaryText="Verify the scraped data by removing any faulty results." />
        <ListItemLink to="/results" primaryText="Results" secondaryText="See an overview of the scraped items and the most recent search results." />
      </List>
    </Paper>

    <Paper className="content-paper" elevation={3}>
      <Typography variant="h3" component="h1" gutterBottom>
        Why? 🤔
      </Typography>
      <Typography className="home-description">
        Price trackers are great, like Tweakers, Kieskeurig, and others, but their search results are usually limited to a few webstores. Usually, this is because they get a kickback from their referrals.<br />
        Also, most items are not available on most price trackers. This is where TweakedTweakers comes in! 🎉<br />
        <br />
        The goal was to create a web application that scrapes data for provided items, for provided webstores.<br />
        By creating an interface for it, we can also specify what items we want to scrape at that moment, and from which webstores.<br />
        Initially, the idea was to run a script and paste the data into a spreadsheet, but this was more fun.
      </Typography>
    </Paper>
  </Box>
);

export default Home;
