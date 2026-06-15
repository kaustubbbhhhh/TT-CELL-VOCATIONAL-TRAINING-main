import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4A6331',       // olive-mid
      light: '#8FA878',      // olive-pale
      dark: '#2D3B1F',       // olive
      contrastText: '#fff',
    },
    secondary: {
      main: '#B8960C',       // gold
      light: '#D4AF37',      // gold-light
      dark: '#7A6000',
      contrastText: '#1A2332',
    },
    steel: {
      main: '#1A2332',
      mid: '#2C3E55',
      light: '#3D5A80',
      pale: '#8FA8C8',
      faint: '#EBF2F9',
    },
    error: {
      main: '#C0392B',
      light: '#FCECEA',
    },
    warning: {
      main: '#B8960C',
      light: '#FAF5DC',
    },
    success: {
      main: '#1D6A42',
      light: '#EAFAF1',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2332',
      secondary: '#445566',
      disabled: '#7A8B99',
    },
    divider: '#D0D9E5',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.5px' },
    h2: { fontWeight: 800, letterSpacing: '-0.3px' },
    h3: { fontWeight: 800 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#7A8B99' },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.2px' },
    caption: { color: '#7A8B99' },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0 1px 3px rgba(26,35,50,0.08)',
    '0 2px 8px rgba(26,35,50,0.1)',
    '0 4px 16px rgba(26,35,50,0.1)',
    '0 8px 24px rgba(26,35,50,0.12)',
    '0 16px 40px rgba(26,35,50,0.14)',
    '0 24px 64px rgba(26,35,50,0.16)',
    ...Array(18).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: '0.875rem',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: '#4A6331',
          '&:hover': { background: '#3D5229' },
        },
        containedSecondary: {
          background: '#B8960C',
          color: '#1A2332',
          '&:hover': { background: '#D4AF37' },
        },
        outlined: {
          borderColor: '#B8C5D3',
          color: '#445566',
          '&:hover': { background: '#EBF0F5', borderColor: '#8FA8C8' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#1A2332',
          borderBottom: '2px solid #B8960C',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          borderRight: '1px solid #D0D9E5',
          width: 236,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(26,35,50,0.08)',
          border: '1px solid #D0D9E5',
          borderRadius: 12,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: '#F5F7FA',
            fontWeight: 800,
            fontSize: '0.7rem',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            color: '#7A8B99',
            borderBottom: '2px solid #D0D9E5',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #EBF0F5',
          padding: '11px 16px',
          fontSize: '0.8375rem',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: '#F5F7FA' },
          '&:last-child td': { borderBottom: 'none' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.7rem',
          height: 22,
          borderRadius: 20,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 10, height: 6, background: '#EBF0F5' },
        bar: { borderRadius: 10 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '1px 8px',
          width: 'calc(100% - 16px)',
          padding: '7px 10px',
          '&.Mui-selected': {
            background: '#EEF2E8',
            color: '#4A6331',
            fontWeight: 700,
            '&:hover': { background: '#EEF2E8' },
          },
          '&:hover': { background: '#F5F7FA' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4A6331',
            borderWidth: 2,
          },
        },
        notchedOutline: { borderColor: '#B8C5D3' },
        input: { padding: '9px 12px', fontSize: '0.875rem' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: '#1A2332',
          '&.Mui-focused': { color: '#4A6331' },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.875rem',
          minWidth: 100,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
  },
});

export default theme;
