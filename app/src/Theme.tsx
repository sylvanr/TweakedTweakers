import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4C1C24',
        },
        background: {
            default: '#181a1b',
            paper: '#282b2c',
        },
        text: {
            primary: '#e8e6e3',
            secondary: '#b2aca2',
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
    },
});

export default theme;
