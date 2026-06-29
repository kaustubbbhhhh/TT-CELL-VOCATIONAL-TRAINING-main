import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4B5D3A', // Deep Olive
      contrastText: '#FAF8F3',
    },
    secondary: {
      main: '#7D7658', // Khaki
      contrastText: '#FAF8F3',
    },
    accent: {
      main: '#C17B2E', // Muted Saffron
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F2EC', // Warm Institutional White
      paper: '#FAF8F3', // Soft Paper
    },
    text: {
      primary: '#222222',
      secondary: '#444444',
      disabled: '#888888',
    },
    success: {
      main: '#547A43',
    },
    warning: {
      main: '#B68A2D',
    },
    error: {
      main: '#9E3A36',
    },
    divider: '#D6D0C4', // Clean borders
    custom: {
      border: '#D6D0C4',
      charts: ['#4B5D3A', '#7D7658', '#C17B2E', '#8C8470', '#547A43'],
    }
  },
  typography: {
    fontFamily: '"Source Sans 3", "Inter", system-ui, -apple-system, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.5px' }, // 40px
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.3px' }, // 32px
    h3: { fontSize: '1.5rem', fontWeight: 600 }, // 24px
    h4: { fontSize: '1.25rem', fontWeight: 600 }, // 20px
    h5: { fontSize: '1rem', fontWeight: 600 }, // 16px
    h6: { fontSize: '0.875rem', fontWeight: 600 }, // 14px
    body1: { fontSize: '1rem', lineHeight: 1.5 }, // 16px
    body2: { fontSize: '0.9375rem', lineHeight: 1.5 }, // 15px
    subtitle1: { fontSize: '1rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 600, color: '#444444' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.2px' },
    caption: { fontSize: '0.75rem', color: '#444444' },
    // Custom variant for tabular data
    data: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.875rem' }
  },
  shape: { borderRadius: 8 }, // 8-12px as requested
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.05)', // Low elevation
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 8px 16px rgba(0,0,0,0.05)',
    ...Array(20).fill('none'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: '#4B5D3A',
          color: '#FAF8F3',
          '&:hover': { background: '#3D4A2F' },
        },
        containedSecondary: {
          background: '#7D7658',
          color: '#FAF8F3',
          '&:hover': { background: '#6A6348' },
        },
        outlined: {
          borderColor: '#D6D0C4',
          color: '#222222',
          '&:hover': { background: '#EAE6DB', borderColor: '#7D7658' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FAF8F3',
          color: '#222222',
          borderBottom: '1px solid #D6D0C4',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FAF8F3',
          borderRight: '1px solid #D6D0C4',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#FAF8F3',
          border: '1px solid #D6D0C4',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          borderRadius: 8,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: '#F4F2EC',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: '#444444',
            borderBottom: '2px solid #D6D0C4',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #EAE6DB',
          padding: '12px 16px',
          fontFamily: '"Source Sans 3", sans-serif',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: '#EAE6DB' },
          '&:last-child td': { borderBottom: 'none' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 4, // More disciplined/structured
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Clean government style
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4B5D3A',
            borderWidth: 2,
          },
        },
        notchedOutline: { borderColor: '#D6D0C4' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          color: '#444444',
          '&.Mui-focused': { color: '#4B5D3A' },
          '&.MuiInputLabel-shrink': {
            backgroundColor: '#FAF8F3', // Soft Paper background color matching card/dialog
            padding: '0 6px',
            marginLeft: '-4px',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { 
          borderRadius: 4, 
          fontWeight: 500,
          border: '1px solid',
        },
        standardInfo: {
          backgroundColor: '#F4F2EC',
          color: '#222222',
          borderColor: '#D6D0C4',
        },
        standardSuccess: {
          backgroundColor: '#EEF4EC',
          color: '#1D401D',
          borderColor: '#547A43',
        },
        standardWarning: {
          backgroundColor: '#FAF5DC',
          color: '#5C4410',
          borderColor: '#B68A2D',
        },
        standardError: {
          backgroundColor: '#FCECEA',
          color: '#5E1B1B',
          borderColor: '#9E3A36',
        }
      },
    },
  },
});

export default theme;
