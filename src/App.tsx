import { useState } from 'react';
import { Container, Typography, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { FilterBuilder } from './components/FilterBuilder';
import { DataTable } from './components/DataTable';
import { mockEmployees } from './data/mockData';
import type { Employee } from './types';
import './App.css';

// Create modern Material-UI theme with enhanced colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Modern pink
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const [filteredData, setFilteredData] = useState<Employee[]>(mockEmployees);

  const handleFilteredDataChange = (data: Employee[]) => {
    setFilteredData(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header with gradient background */}
        <Box
          sx={{
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            py: 3,
            px: 3,
            color: 'white',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 1,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            }}
          >
            🎯 Dynamic Filter System
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.95,
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
            }}
          >
            Filter, sort, and analyze your data with an intelligent type-safe filtering system
          </Typography>
        </Box>

        {/* Filter Builder */}
        <FilterBuilder
          data={mockEmployees}
          onFilteredDataChange={handleFilteredDataChange}
        />

        {/* Data Table */}
        <DataTable
          data={filteredData}
          totalCount={mockEmployees.length}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
