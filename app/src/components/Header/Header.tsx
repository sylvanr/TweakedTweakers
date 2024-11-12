import React from 'react';
import { AppBar, Toolbar, Box, IconButton, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import HeaderLink from './HeaderLink';

const Header = () => {
    const location = useLocation();

    return (
        <AppBar position="static" color="default" className="app-bar">
            <Toolbar className="toolbar">
                {/* Wrapper to center content */}
                <Box className="content-wrapper" display="flex" justifyContent="space-between" alignItems="center">
                    {/* Logo with Name */}
                    <Box display="flex" alignItems="center">
                        <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/" className="logo-container" disableRipple>
                            <img src="/Logo.svg" alt="Logo" width={30} height={30} />
                            <Typography variant="h6" component="div" className="logo-text" style={{ marginLeft: 8, color: '#dea5ae' }}>
                                TweakedTweakers
                            </Typography>
                        </IconButton>
                    </Box>

                    {/* Header links */}
                    <Box className="header-links" display="flex">
                        <HeaderLink to="/manage" toName="Manage" location={location} />
                        <HeaderLink to="/scrape" toName="Scrape" location={location} />
                        <HeaderLink to="/verify" toName="Verify Data" location={location} />
                        <HeaderLink to="/results" toName="Results" location={location} />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
