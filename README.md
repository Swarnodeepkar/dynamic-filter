# Dynamic Filter Component System

A reusable, type-safe dynamic filter component system for React applications. Built with TypeScript, Material-UI, and designed to work with any data table.

## Live Demo

The application is running locally at: `http://localhost:5173/`

## Features

### Core Functionality

- **Dynamic Filter Builder**: Add, modify, and remove filter conditions in real-time
- **Multi-Type Filter Support**: Handles 7 different data types with appropriate operators
- **Real-time Filtering**: Instant table updates as filters are applied
- **Type-Safe Architecture**: Full TypeScript support with strict type checking
- **Sortable Data Table**: Click column headers to sort data
- **Responsive Design**: Works on desktop and mobile devices
- **Validation**: Built-in validation for filter conditions

### Supported Filter Types

#### 1. Text Fields
- **Operators**: Equals, Contains, Starts With, Ends With, Does Not Contain
- **Input**: Text input field
- **Example Fields**: Name, Email, Role

#### 2. Number Fields
- **Operators**: Equals, Greater Than, Less Than, Greater Than or Equal, Less Than or Equal
- **Input**: Number input with validation
- **Example Fields**: Number of Projects, Performance Rating

#### 3. Date Fields
- **Operators**: Between (date range)
- **Input**: Date range picker with start and end dates
- **Example Fields**: Join Date, Last Review Date

#### 4. Amount/Currency Fields
- **Operators**: Between (amount range)
- **Input**: Number inputs for min/max with currency formatting
- **Example Fields**: Salary

#### 5. Single Select Fields
- **Operators**: Is, Is Not
- **Input**: Dropdown with predefined options
- **Example Fields**: Department, State, Country

#### 6. Multi-Select Fields
- **Operators**: In, Not In
- **Input**: Multi-select dropdown with checkboxes
- **Example Fields**: Skills

#### 7. Boolean Fields
- **Operators**: Is
- **Input**: Toggle switch
- **Example Fields**: Active Status

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Component library for professional UI
- **Lucide React** - Icon library
- **date-fns** - Date manipulation utilities

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. Clone or navigate to the project directory:
```bash
cd dynamic-filter-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173/
```

## Project Structure

```
dynamic-filter-system/
├── src/
│   ├── components/
│   │   ├── FilterInputs/
│   │   │   ├── TextInput.tsx          # Text input component
│   │   │   ├── NumberInput.tsx        # Number input component
│   │   │   ├── DateRangeInput.tsx     # Date range picker
│   │   │   ├── AmountRangeInput.tsx   # Currency range input
│   │   │   ├── SingleSelectInput.tsx  # Single select dropdown
│   │   │   ├── MultiSelectInput.tsx   # Multi-select with checkboxes
│   │   │   ├── BooleanInput.tsx       # Boolean toggle switch
│   │   │   └── index.ts               # Export barrel
│   │   ├── FilterCondition.tsx        # Individual filter row component
│   │   ├── FilterBuilder.tsx          # Main filter container
│   │   └── DataTable.tsx              # Sortable data table
│   ├── config/
│   │   └── fieldConfig.ts             # Field definitions and mappings
│   ├── data/
│   │   └── mockData.ts                # Sample dataset (55 employees)
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   ├── utils/
│   │   └── filterEngine.ts            # Client-side filtering algorithms
│   ├── App.tsx                        # Main application component
│   ├── App.css                        # Application styles
│   ├── index.css                      # Global styles
│   └── main.tsx                       # Application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Architecture & Design

### Component Hierarchy

```
App
└── FilterBuilder
    ├── FilterCondition (multiple)
    │   └── Dynamic Input Component (based on field type)
    │       ├── TextInput
    │       ├── NumberInput
    │       ├── DateRangeInput
    │       ├── AmountRangeInput
    │       ├── SingleSelectInput
    │       ├── MultiSelectInput
    │       └── BooleanInput
└── DataTable
```

### Key Design Decisions

#### 1. Type Safety
All components use strict TypeScript interfaces to ensure type safety:
- `FilterCondition`: Defines filter structure
- `FieldConfig`: Configures available fields
- `FilterValue`: Union type for all possible values
- `Employee`: Data model interface

#### 2. Separation of Concerns
- **Components**: UI rendering and user interaction
- **Utils**: Business logic and filtering algorithms
- **Config**: Field definitions and operator mappings
- **Types**: Type definitions and interfaces
- **Data**: Mock data separate from logic

#### 3. Dynamic Input Rendering
The `FilterCondition` component dynamically renders the appropriate input based on the selected field type:

```typescript
switch (fieldConfig.type) {
  case 'text': return <TextInput {...props} />;
  case 'number': return <NumberInput {...props} />;
  case 'date': return <DateRangeInput {...props} />;
  // ... etc
}
```

#### 4. Filtering Algorithm
The filtering engine uses a modular approach with dedicated functions for each data type:
- `applyTextFilter()`: Case-insensitive text matching
- `applyNumberFilter()`: Numeric comparisons
- `applyDateFilter()`: Date range filtering with proper parsing
- `applyAmountFilter()`: Numeric range filtering
- `applySingleSelectFilter()`: Exact matching
- `applyMultiSelectFilter()`: Array contains/excludes logic
- `applyBooleanFilter()`: Boolean matching

#### 5. State Management
- React `useState` for local component state
- Props drilling for parent-child communication
- Callback functions for upward data flow
- Memoization for performance optimization

### Performance Optimizations

1. **Memoization**: Using `useMemo` for expensive computations
2. **Callback Optimization**: Using `useCallback` to prevent unnecessary re-renders
3. **Efficient Filtering**: Single-pass filtering algorithm
4. **Conditional Rendering**: Only render necessary components

## Usage Examples

### Basic Usage

```typescript
import { FilterBuilder } from './components/FilterBuilder';
import { DataTable } from './components/DataTable';
import { mockEmployees } from './data/mockData';

function App() {
  const [filteredData, setFilteredData] = useState(mockEmployees);

  return (
    <>
      <FilterBuilder
        data={mockEmployees}
        onFilteredDataChange={setFilteredData}
      />
      <DataTable
        data={filteredData}
        totalCount={mockEmployees.length}
      />
    </>
  );
}
```

### Adding New Field Types

To add a new filterable field:

1. Update the `Employee` interface in [src/types/index.ts](src/types/index.ts)
2. Add field configuration to [src/config/fieldConfig.ts](src/config/fieldConfig.ts):

```typescript
{
  key: 'newField',
  label: 'New Field Label',
  type: 'text', // or appropriate type
  operators: ['equals', 'contains'],
}
```

3. Add data to [src/data/mockData.ts](src/data/mockData.ts)

### Creating Custom Filter Input

To create a custom input component:

```typescript
import React from 'react';
import { CustomFilterValue } from '../types';

interface CustomInputProps {
  value: CustomFilterValue;
  onChange: (value: CustomFilterValue) => void;
  error?: boolean;
  helperText?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChange,
  error,
  helperText,
}) => {
  // Implement custom input logic
  return <div>Custom Input</div>;
};
```

## Data Structure

### Employee Data Model

```typescript
interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  skills: string[];
  address: {
    city: string;
    state: string;
    country: string;
  };
  projects: number;
  lastReview: string;
  performanceRating: number;
}
```

### Sample Dataset

The application includes a comprehensive mock dataset with:
- 55 employee records
- Diverse data across all field types
- Realistic variations for meaningful filtering
- Nested object support (address)
- Array field support (skills)

## Filter Logic

### AND Between Different Fields

Multiple filter conditions on different fields use AND logic:
- Department = "Engineering" AND Salary > $90,000
- Result: Only employees in Engineering with salary > $90,000

### OR Within Same Field

Not currently implemented, but can be extended to support OR logic within the same field.

### Nested Object Filtering

The system supports filtering on nested objects using dot notation:
- Field: `address.city`
- Path: `address.city`
- The filtering engine handles nested property access automatically

## Validation

Filter conditions are validated before applying:
- Text fields must not be empty
- Number fields must contain valid numbers
- Date ranges must have valid start and end dates
- Amount ranges must have valid min/max values
- Select fields must have selected values
- Multi-select must have at least one selection

Invalid conditions are highlighted with a red border and prevent filter application.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential improvements for the system:

1. **Filter Persistence**: Save filters to localStorage or URL params
2. **Export Functionality**: Export filtered data to CSV/JSON
3. **Advanced Operators**: Regex matching, custom date ranges (last 30 days, etc.)
4. **Filter Presets**: Save and load common filter combinations
5. **Debounced Updates**: Reduce re-renders during rapid input
6. **Accessibility**: ARIA labels and keyboard navigation
7. **Filter Groups**: Support for complex AND/OR combinations
8. **Virtual Scrolling**: Handle very large datasets efficiently
9. **Backend Integration**: Connect to real APIs
10. **Unit Tests**: Comprehensive test coverage

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```



