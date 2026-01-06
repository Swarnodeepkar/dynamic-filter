import { useState, useCallback, useMemo } from 'react';
import { Box, Button, Typography, Paper, Chip } from '@mui/material';
import { Plus, X, Filter } from 'lucide-react';
import { FilterCondition } from './FilterCondition';
import type {
  FilterCondition as FilterConditionType,
  Employee,
} from '../types';
import { filterEmployees, isValidFilterCondition } from '../utils/filterEngine';
import { FIELD_CONFIGS } from '../config/fieldConfig';

interface FilterBuilderProps {
  data: Employee[];
  onFilteredDataChange: (filteredData: Employee[]) => void;
}

/**
 * FilterBuilder is the main container component for the dynamic filter system
 * Manages filter state and coordinates filtering operations
 */
export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  data,
  onFilteredDataChange,
}) => {
  const [conditions, setConditions] = useState<FilterConditionType[]>([]);
  const [conditionErrors, setConditionErrors] = useState<Record<string, boolean>>({});

  // Generate field path mapping for nested fields
  const fieldPaths = useMemo(() => {
    const paths: Record<string, string> = {};
    FIELD_CONFIGS.forEach(config => {
      if (config.path) {
        paths[config.key] = config.path;
      }
    });
    return paths;
  }, []);

  // Add a new filter condition
  const handleAddCondition = useCallback(() => {
    const firstField = FIELD_CONFIGS[0];
    const newCondition: FilterConditionType = {
      id: `filter-${Date.now()}-${Math.random()}`,
      field: firstField.key,
      operator: firstField.operators[0],
      fieldType: firstField.type,
      value: getDefaultValueForFieldType(firstField.type),
    };

    setConditions((prev) => [...prev, newCondition]);
  }, []);

  // Update a specific condition
  const handleUpdateCondition = useCallback(
    (id: string, updatedCondition: FilterConditionType) => {
      setConditions((prev) =>
        prev.map((condition) =>
          condition.id === id ? updatedCondition : condition
        )
      );
    },
    []
  );

  // Remove a specific condition
  const handleRemoveCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((condition) => condition.id !== id));
    setConditionErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
  }, []);

  // Clear all conditions
  const handleClearAll = useCallback(() => {
    setConditions([]);
    setConditionErrors({});
    onFilteredDataChange(data);
  }, [data, onFilteredDataChange]);

  // Apply filters to data
  const handleApplyFilters = useCallback(() => {
    // Validate all conditions
    const errors: Record<string, boolean> = {};
    let hasErrors = false;

    conditions.forEach((condition) => {
      if (!isValidFilterCondition(condition)) {
        errors[condition.id] = true;
        hasErrors = true;
      }
    });

    setConditionErrors(errors);

    if (hasErrors) {
      return;
    }

    // Apply filters
    const filtered = filterEmployees(data, conditions, fieldPaths);
    onFilteredDataChange(filtered);
  }, [conditions, data, fieldPaths, onFilteredDataChange]);

  // Get default value for field type
  const getDefaultValueForFieldType = (fieldType: string): any => {
    switch (fieldType) {
      case 'text':
        return { value: '' };
      case 'number':
        return { value: 0 };
      case 'date':
        return { startDate: '', endDate: '' };
      case 'amount':
        return { minAmount: 0, maxAmount: 0 };
      case 'singleSelect':
        return { value: '' };
      case 'multiSelect':
        return { values: [] };
      case 'boolean':
        return { value: false };
      default:
        return { value: '' };
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
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
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
          <Filter size={20} color="white" />
        </Box>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          Filter Builder
        </Typography>
        {conditions.length > 0 && (
          <Chip
            label={`${conditions.length} active`}
            color="primary"
            size="small"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              height: '24px',
            }}
          />
        )}
      </Box>

      {/* Filter Conditions */}
      {conditions.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            px: 3,
            color: 'text.secondary',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'primary.light',
            opacity: 0.8,
          }}
        >
          <Box sx={{ fontSize: '2rem', mb: 1 }}>🔍</Box>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem' }}>
            No filters applied
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            Click "Add Filter" to start filtering
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          {conditions.map((condition) => (
            <FilterCondition
              key={condition.id}
              condition={condition}
              onChange={(updated) => handleUpdateCondition(condition.id, updated)}
              onRemove={() => handleRemoveCondition(condition.id)}
              error={conditionErrors[condition.id]}
            />
          ))}
        </Box>
      )}

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          mt: 3,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleAddCondition}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Add Filter
          </Button>
          {conditions.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<X size={18} />}
              onClick={handleClearAll}
              sx={{
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {conditions.length > 0 && (
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Apply Filters
          </Button>
        )}
      </Box>
    </Paper>
  );
};
