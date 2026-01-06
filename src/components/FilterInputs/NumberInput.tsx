import { TextField } from '@mui/material';
import type { NumberFilterValue } from '../../types';

interface NumberInputProps {
  value: NumberFilterValue;
  onChange: (value: NumberFilterValue) => void;
  error?: boolean;
  helperText?: string;
}

/**
 * Number input component for numeric filters
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  error = false,
  helperText = '',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(event.target.value);
    onChange({ value: isNaN(numValue) ? 0 : numValue });
  };

  return (
    <TextField
      size="small"
      fullWidth
      type="number"
      value={value.value || 0}
      onChange={handleChange}
      placeholder="Enter number..."
      error={error}
      helperText={helperText}
    />
  );
};
