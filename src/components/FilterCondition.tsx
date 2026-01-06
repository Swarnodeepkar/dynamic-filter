import { useMemo } from 'react';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import type {
  FilterCondition as FilterConditionType,
  FilterValue,
  FieldType,
  TextFilterValue,
  NumberFilterValue,
  DateFilterValue,
  AmountFilterValue,
  SingleSelectFilterValue,
  MultiSelectFilterValue,
  BooleanFilterValue,
} from '../types';
import { OPERATOR_LABELS } from '../types';
import { FIELD_CONFIGS, getFieldConfig } from '../config/fieldConfig';
import {
  TextInput,
  NumberInput,
  DateRangeInput,
  AmountRangeInput,
  SingleSelectInput,
  MultiSelectInput,
  BooleanInput,
} from './FilterInputs';

interface FilterConditionProps {
  condition: FilterConditionType;
  onChange: (condition: FilterConditionType) => void;
  onRemove: () => void;
  error?: boolean;
}

/**
 * FilterCondition component represents a single filter row
 * Handles field selection, operator selection, and value input
 */
export const FilterCondition: React.FC<FilterConditionProps> = ({
  condition,
  onChange,
  onRemove,
  error = false,
}) => {
  // Get the current field configuration
  const fieldConfig = useMemo(
    () => getFieldConfig(condition.field),
    [condition.field]
  );

  // Handle field selection change
  const handleFieldChange = (event: any) => {
    const newFieldKey = event.target.value as string;
    const newFieldConfig = getFieldConfig(newFieldKey);

    if (!newFieldConfig) return;

    // Reset operator and value when field changes
    const defaultOperator = newFieldConfig.operators[0];
    const defaultValue = getDefaultValueForFieldType(newFieldConfig.type);

    onChange({
      ...condition,
      field: newFieldKey,
      fieldType: newFieldConfig.type,
      operator: defaultOperator,
      value: defaultValue,
    });
  };

  // Handle operator change
  const handleOperatorChange = (event: any) => {
    onChange({
      ...condition,
      operator: event.target.value,
    });
  };

  // Handle value change
  const handleValueChange = (newValue: FilterValue) => {
    onChange({
      ...condition,
      value: newValue,
    });
  };

  // Get default value based on field type
  const getDefaultValueForFieldType = (fieldType: FieldType): FilterValue => {
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

  // Render the appropriate input component based on field type
  const renderValueInput = () => {
    if (!fieldConfig) return null;

    switch (fieldConfig.type) {
      case 'text':
        return (
          <TextInput
            value={condition.value as TextFilterValue}
            onChange={handleValueChange}
            error={error}
          />
        );
      case 'number':
        return (
          <NumberInput
            value={condition.value as NumberFilterValue}
            onChange={handleValueChange}
            error={error}
          />
        );
      case 'date':
        return (
          <DateRangeInput
            value={condition.value as DateFilterValue}
            onChange={handleValueChange}
            error={error}
          />
        );
      case 'amount':
        return (
          <AmountRangeInput
            value={condition.value as AmountFilterValue}
            onChange={handleValueChange}
            error={error}
          />
        );
      case 'singleSelect':
        return (
          <SingleSelectInput
            value={condition.value as SingleSelectFilterValue}
            onChange={handleValueChange}
            options={fieldConfig.options || []}
            error={error}
          />
        );
      case 'multiSelect':
        return (
          <MultiSelectInput
            value={condition.value as MultiSelectFilterValue}
            onChange={handleValueChange}
            options={fieldConfig.options || []}
            error={error}
          />
        );
      case 'boolean':
        return (
          <BooleanInput
            value={condition.value as BooleanFilterValue}
            onChange={handleValueChange}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 2,
        borderLeft: error ? '4px solid #ef4444' : '4px solid #6366f1',
        border: '1px solid',
        borderColor: error ? 'error.light' : 'divider',
        borderRadius: 2,
        backgroundColor: error ? 'rgba(239, 68, 68, 0.02)' : 'rgba(255, 255, 255, 0.9)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: error
            ? '0 4px 12px rgba(239, 68, 68, 0.15)'
            : '0 4px 12px rgba(99, 102, 241, 0.15)',
          transform: 'translateX(4px)',
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 2fr auto' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        {/* Field Selection */}
        <FormControl fullWidth size="small">
          <Select
            value={condition.field}
            onChange={handleFieldChange}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
          >
            {FIELD_CONFIGS.map((config) => (
              <MenuItem key={config.key} value={config.key}>
                {config.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Operator Selection */}
        <FormControl fullWidth size="small">
          <Select
            value={condition.operator}
            onChange={handleOperatorChange}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
          >
            {fieldConfig?.operators.map((operator) => (
              <MenuItem key={operator} value={operator}>
                {OPERATOR_LABELS[operator]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Value Input */}
        <Box>{renderValueInput()}</Box>

        {/* Remove Button */}
        <IconButton
          onClick={onRemove}
          color="error"
          size="small"
          sx={{
            mt: 0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1) rotate(5deg)',
              backgroundColor: 'error.light',
              color: 'white',
            },
          }}
        >
          <Trash2 size={20} />
        </IconButton>
      </Box>
    </Paper>
  );
};
