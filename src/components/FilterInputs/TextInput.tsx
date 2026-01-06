import { TextField } from '@mui/material';
import type { TextFilterValue } from '../../types';

interface TextInputProps {
  value: TextFilterValue;
  onChange: (value: TextFilterValue) => void;
  error?: boolean;
  helperText?: string;
}

/**
 * Text input component for text-based filters
 */
export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  error = false,
  helperText = '',
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ value: event.target.value });
  };

  return (
    <TextField
      size="small"
      fullWidth
      value={value.value || ''}
      onChange={handleChange}
      placeholder="Enter text..."
      error={error}
      helperText={helperText}
    />
  );
};
