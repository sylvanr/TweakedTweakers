import React from 'react';
import { Paper, Button, Typography, TextField, Box } from '@mui/material';

const Sidebar = () => (
    <Paper
        elevation={3}
        sx={{
            width: '200px',  // Fixed sidebar width
            padding: 2,
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            position: 'fixed',  // Keep sidebar fixed on the screen
            left: '10%',  // Offset by 10% to leave space on the left
            top: 0,
            bottom: 0,
        }}
    >
        <Typography variant="h6" color="text.primary">
            Filter
        </Typography>
        <Button variant="contained" color="primary" fullWidth>Show Charts</Button>
        <Button variant="contained" color="primary" fullWidth>Show BUY NOW</Button>
        <Button variant="contained" color="primary" fullWidth>Hide Negative Percentages</Button>

        <Typography variant="subtitle1" color="text.secondary" sx={{ marginTop: 2 }}>
            Search Items
        </Typography>
        <TextField
            variant="outlined"
            placeholder="Type to search"
            fullWidth
            sx={{ backgroundColor: 'background.default' }}
            InputProps={{
                endAdornment: (
                    <Button size="small" color="inherit">
                        &times;
                    </Button>
                ),
            }}
        />
    </Paper>
);

export default Sidebar;
