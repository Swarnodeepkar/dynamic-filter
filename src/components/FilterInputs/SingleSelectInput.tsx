import { FormControl, Select, MenuItem, FormHelperText } from '@mui/material';
import type { SingleSelectFilterValue } from '../../types';

interface SingleSelectInputProps {
  value: SingleSelectFilterValue;
  onChange: (value: SingleSelectFilterValue) => void;
  options: string[];
  error?: boolean;
  helperText?: string;
}

/**
 * Single select dropdown component for single-choice filters
 */
export const SingleSelectInput: React.FC<SingleSelectInputProps> = ({
  value,
  onChange,
  options,
  error = false,
  helperText = '',
}) => {
  const handleChange = (event: any) => {
    onChange({ value: event.target.value as string });
  };

  return (
    <FormControl fullWidth size="small" error={error}>
      <Select
        value={value.value || ''}
        onChange={handleChange}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Select option...
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
