import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText,
  Chip,
  Box,
} from '@mui/material';
import type { MultiSelectFilterValue } from '../../types';

interface MultiSelectInputProps {
  value: MultiSelectFilterValue;
  onChange: (value: MultiSelectFilterValue) => void;
  options: string[];
  error?: boolean;
  helperText?: string;
}

/**
 * Multi-select dropdown component with checkboxes for multi-choice filters
 */
export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  value,
  onChange,
  options,
  error = false,
  helperText = '',
}) => {
  const handleChange = (event: any) => {
    const selectedValues = event.target.value as string[];
    onChange({ values: selectedValues });
  };

  return (
    <FormControl fullWidth size="small" error={error}>
      <Select
        multiple
        value={value.values || []}
        onChange={handleChange}
        displayEmpty
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Select options...</em>;
          }
          return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((val) => (
                <Chip key={val} label={val} size="small" />
              ))}
            </Box>
          );
        }}
      >
        <MenuItem value="" disabled>
          <em>Select options...</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.values?.includes(option) || false} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
