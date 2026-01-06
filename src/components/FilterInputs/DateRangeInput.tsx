import { Box, TextField } from '@mui/material';
import type { DateFilterValue } from '../../types';

interface DateRangeInputProps {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
  error?: boolean;
  helperText?: string;
}

/**
 * Date range input component for date-based filters
 */
export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  value,
  onChange,
  error = false,
  helperText = '',
}) => {
  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      startDate: event.target.value,
    });
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      endDate: event.target.value,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
      <TextField
        size="small"
        fullWidth
        type="date"
        label="Start Date"
        value={value.startDate || ''}
        onChange={handleStartDateChange}
        InputLabelProps={{ shrink: true }}
        error={error}
      />
      <TextField
        size="small"
        fullWidth
        type="date"
        label="End Date"
        value={value.endDate || ''}
        onChange={handleEndDateChange}
        InputLabelProps={{ shrink: true }}
        error={error}
        helperText={helperText}
      />
    </Box>
  );
};
