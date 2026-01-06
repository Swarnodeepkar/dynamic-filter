// Core data types
export interface Employee {
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

// Filter-related types
export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'amount'
  | 'singleSelect'
  | 'multiSelect'
  | 'boolean';

export type TextOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'doesNotContain';

export type NumberOperator =
  | 'equals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual';

export type DateOperator = 'between';

export type AmountOperator = 'between';

export type SingleSelectOperator = 'is' | 'isNot';

export type MultiSelectOperator = 'in' | 'notIn';

export type BooleanOperator = 'is';

export type FilterOperator =
  | TextOperator
  | NumberOperator
  | DateOperator
  | AmountOperator
  | SingleSelectOperator
  | MultiSelectOperator
  | BooleanOperator;

// Filter value types based on field type
export interface TextFilterValue {
  value: string;
}

export interface NumberFilterValue {
  value: number;
}

export interface DateFilterValue {
  startDate: string;
  endDate: string;
}

export interface AmountFilterValue {
  minAmount: number;
  maxAmount: number;
}

export interface SingleSelectFilterValue {
  value: string;
}

export interface MultiSelectFilterValue {
  values: string[];
}

export interface BooleanFilterValue {
  value: boolean;
}

export type FilterValue =
  | TextFilterValue
  | NumberFilterValue
  | DateFilterValue
  | AmountFilterValue
  | SingleSelectFilterValue
  | MultiSelectFilterValue
  | BooleanFilterValue;

// Field configuration
export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  operators: FilterOperator[];
  options?: string[]; // For single/multi select fields
  path?: string; // For nested fields (e.g., "address.city")
}

// Filter condition
export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: FilterValue;
  fieldType: FieldType;
}

// Filter state
export interface FilterState {
  conditions: FilterCondition[];
}

// Operator labels for display
export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  // Text operators
  equals: 'Equals',
  contains: 'Contains',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  doesNotContain: 'Does Not Contain',
  // Number operators
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than or Equal',
  lessThanOrEqual: 'Less Than or Equal',
  // Date/Amount operators
  between: 'Between',
  // Select operators
  is: 'Is',
  isNot: 'Is Not',
  in: 'In',
  notIn: 'Not In',
};

// Field type to operators mapping
export const FIELD_TYPE_OPERATORS: Record<FieldType, FilterOperator[]> = {
  text: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  number: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  date: ['between'],
  amount: ['between'],
  singleSelect: ['is', 'isNot'],
  multiSelect: ['in', 'notIn'],
  boolean: ['is'],
};
