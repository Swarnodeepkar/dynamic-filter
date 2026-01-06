import { FormControl, FormControlLabel, Switch, FormHelperText } from '@mui/material';
import type { BooleanFilterValue } from '../../types';

interface BooleanInputProps {
  value: BooleanFilterValue;
  onChange: (value: BooleanFilterValue) => void;
  error?: boolean;
  helperText?: string;
}

/**
 * Boolean toggle switch component for boolean filters
 */
export const BooleanInput: React.FC<BooleanInputProps> = ({
  value,
  onChange,
  error = false,
  helperText = '',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ value: event.target.checked });
  };

  return (
    <FormControl fullWidth error={error}>
      <FormControlLabel
        control={
          <Switch
            checked={value.value || false}
            onChange={handleChange}
            color="primary"
          />
        }
        label={value.value ? 'True' : 'False'}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
