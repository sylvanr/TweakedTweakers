// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';

import Home from './pages/Home';
import Scrape from './pages/Scrape';
import VerifyData from './pages/VerifyData';
import Results from './pages/Results';
import Manage from './pages/Manage';

import Header from './components/Header';

import theme from './Theme';
import './App.css';

const AppLayout = () => {
  const location = useLocation();
  const isResultsPage = location.pathname === '/results';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div className="body-container">
        <main className={`main-content ${isResultsPage ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/scrape" element={<Scrape />} />
            <Route path="/verify" element={<VerifyData />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
