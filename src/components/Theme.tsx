import { createTheme } from '@mui/material/styles';

// Define custom theme
const customTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#37474F', // Dark gray background color
      },
      secondary: {
        main: '#4CAF50', // Green accent color
      },
      text: {
        primary: '#FFFFFF', // White text color
        secondary: '#B0BEC5', // Light gray text color
      },
      background: {
        default: '#263238', // Dark blue-gray background color
        paper: '#37474F', // Dark gray surface color
      },
    },
    typography: {
      fontFamily: '"Courier New", Courier, monospace', // Terminal-like font
      fontSize: 14,
      fontWeightRegular: 400,
    },
    shape: {
      borderRadius: 4, // Rounded corners for elements
    }
  });

export default customTheme;