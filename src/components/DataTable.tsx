import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
} from '@mui/material';
import type { Employee } from '../types';

interface DataTableProps {
  data: Employee[];
  totalCount: number;
}

type SortDirection = 'asc' | 'desc';
type SortableField = keyof Employee | 'address.city' | 'address.state';

/**
 * DataTable component displays employee data with sortable columns
 * Shows record counts and handles empty states
 */
export const DataTable: React.FC<DataTableProps> = ({ data, totalCount }) => {
  const [orderBy, setOrderBy] = useState<SortableField>('name');
  const [order, setOrder] = useState<SortDirection>('asc');

  // Handle sort request
  const handleRequestSort = (property: SortableField) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Get nested value for sorting
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  };

  // Sort data
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (orderBy.includes('.')) {
        aValue = getNestedValue(a, orderBy);
        bValue = getNestedValue(b, orderBy);
      } else {
        aValue = a[orderBy as keyof Employee];
        bValue = b[orderBy as keyof Employee];
      }

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return order === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Default comparison
      return order === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, order, orderBy]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        background: 'linear-gradient(to bottom, #ffffff, #fafbff)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.12)',
        },
      }}
    >
      {/* Header with counts */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontSize: '1.25rem' }}>📊</Typography>
          </Box>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Employee Data
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={`${data.length} shown`}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              height: '24px',
            }}
          />
          <Chip
            label={`${totalCount} total`}
            size="small"
            sx={{
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'primary.main',
              fontWeight: 600,
              border: '2px solid',
              borderColor: 'primary.light',
              height: '24px',
            }}
          />
        </Box>
      </Box>

      {/* Table */}
      {data.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 5,
            px: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'primary.light',
          }}
        >
          <Box sx={{ fontSize: '2.5rem', mb: 1 }}>🔍</Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem' }}>
            No results found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            Try adjusting your filters to see more results.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            maxHeight: 600,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#555',
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  },
                  '& .MuiTableSortLabel-root': {
                    color: 'white !important',
                    '&:hover': {
                      color: 'rgba(255, 255, 255, 0.8) !important',
                    },
                    '&.Mui-active': {
                      color: 'white !important',
                    },
                  },
                  '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                  },
                }}
              >
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={() => handleRequestSort('email')}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'department'}
                    direction={orderBy === 'department' ? order : 'asc'}
                    onClick={() => handleRequestSort('department')}
                  >
                    Department
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'role'}
                    direction={orderBy === 'role' ? order : 'asc'}
                    onClick={() => handleRequestSort('role')}
                  >
                    Role
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'salary'}
                    direction={orderBy === 'salary' ? order : 'asc'}
                    onClick={() => handleRequestSort('salary')}
                  >
                    Salary
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'joinDate'}
                    direction={orderBy === 'joinDate' ? order : 'asc'}
                    onClick={() => handleRequestSort('joinDate')}
                  >
                    Join Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'address.city'}
                    direction={orderBy === 'address.city' ? order : 'asc'}
                    onClick={() => handleRequestSort('address.city')}
                  >
                    Location
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'projects'}
                    direction={orderBy === 'projects' ? order : 'asc'}
                    onClick={() => handleRequestSort('projects')}
                  >
                    Projects
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'isActive'}
                    direction={orderBy === 'isActive' ? order : 'asc'}
                    onClick={() => handleRequestSort('isActive')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'performanceRating'}
                    direction={orderBy === 'performanceRating' ? order : 'asc'}
                    onClick={() => handleRequestSort('performanceRating')}
                  >
                    Rating
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.04)',
                      transform: 'scale(1.001)',
                    },
                    backgroundColor: index % 2 === 0 ? 'rgba(248, 250, 252, 0.5)' : 'white',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          fontSize: '0.875rem',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(employee.name)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 500 }}>{employee.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {employee.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.department}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        color: 'primary.main',
                      }}
                    />
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(employee.salary)}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(employee.joinDate)}</TableCell>
                  <TableCell>
                    {employee.address.city}, {employee.address.state}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={employee.projects}
                      size="small"
                      sx={{
                        minWidth: '40px',
                        fontWeight: 600,
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        color: 'secondary.main',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={employee.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: employee.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        color: employee.isActive ? 'success.main' : 'text.secondary',
                        border: '1px solid',
                        borderColor: employee.isActive ? 'success.light' : 'divider',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={`⭐ ${employee.performanceRating.toFixed(1)}`}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: employee.performanceRating >= 4.5 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                        color: employee.performanceRating >= 4.5 ? 'success.main' : '#d97706',
                        border: '1px solid',
                        borderColor: employee.performanceRating >= 4.5 ? 'success.light' : '#fbbf24',
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
