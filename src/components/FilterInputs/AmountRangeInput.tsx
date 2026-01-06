import { Box, TextField, InputAdornment } from '@mui/material';
import type { AmountFilterValue } from '../../types';

interface AmountRangeInputProps {
  value: AmountFilterValue;
  onChange: (value: AmountFilterValue) => void;
  error?: boolean;
  helperText?: string;
}

/**
 * Amount range input component for currency/amount filters
 */
export const AmountRangeInput: React.FC<AmountRangeInputProps> = ({
  value,
  onChange,
  error = false,
  helperText = '',
}) => {
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(event.target.value);
    onChange({
      ...value,
      minAmount: isNaN(numValue) ? 0 : numValue,
    });
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(event.target.value);
    onChange({
      ...value,
      maxAmount: isNaN(numValue) ? 0 : numValue,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
      <TextField
        size="small"
        fullWidth
        type="number"
        label="Min Amount"
        value={value.minAmount || 0}
        onChange={handleMinChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        error={error}
      />
      <TextField
        size="small"
        fullWidth
        type="number"
        label="Max Amount"
        value={value.maxAmount || 0}
        onChange={handleMaxChange}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        error={error}
        helperText={helperText}
      />
    </Box>
  );
};
