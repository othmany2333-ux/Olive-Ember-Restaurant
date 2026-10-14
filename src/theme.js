import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#29453a', dark: '#1d332b', light: '#e1eadc', contrastText: '#ffffff' },
    secondary: { main: '#c87851', contrastText: '#ffffff' },
    background: { default: '#fcfaf6', paper: '#ffffff' },
    text: { primary: '#24372f', secondary: '#74776e' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500, lineHeight: 1.12 },
    h2: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500, lineHeight: 1.17 },
    h3: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500, lineHeight: 1.2 },
    h4: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500 },
    h5: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 999, boxShadow: 'none', padding: '10px 20px', '&:hover': { boxShadow: 'none' } } } },
    MuiCard: { styleOverrides: { root: { boxShadow: 'none', border: '1px solid #ecece4' } } },
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
  },
});

export default theme;
