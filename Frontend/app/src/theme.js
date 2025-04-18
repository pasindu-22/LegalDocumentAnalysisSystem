import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4285F4',
      light: '#81B1FF',
      dark: '#0A5DC2',
    },
    secondary: {
      main: '#FF8A65',
      light: '#FFB998',
      dark: '#C75B39',
    },
    background: {
      default: '#0F0F0F',
      paper: '#1F1F1F',
      subtle: '#2A2A2A',
    },
    text: {
      primary: '#F1F1F1',
      secondary: '#AAAAAA',
    },
    success: {
      main: '#66BB6A',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FFA726',
    },
    info: {
      main: '#29B6F6',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#0F0F0F',
          borderBottom: '1px solid #2A2A2A',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F0F0F',
          borderRight: '1px solid #2A2A2A',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #2A2A2A',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#2A2A2A',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4285F4',
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
        },
      },
    },
  },
});