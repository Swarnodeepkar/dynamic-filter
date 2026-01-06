import type {
  Employee,
  FilterCondition,
  TextFilterValue,
  NumberFilterValue,
  DateFilterValue,
  AmountFilterValue,
  SingleSelectFilterValue,
  MultiSelectFilterValue,
  BooleanFilterValue,
} from '../types';

/**
 * Get nested value from object using dot notation path
 * e.g., getNestedValue(employee, 'address.city') returns employee.address.city
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
};

/**
 * Apply text filter condition to a value
 */
const applyTextFilter = (
  value: any,
  operator: string,
  filterValue: TextFilterValue
): boolean => {
  if (value === null || value === undefined) return false;

  const stringValue = String(value).toLowerCase();
  const searchValue = filterValue.value.toLowerCase();

  switch (operator) {
    case 'equals':
      return stringValue === searchValue;
    case 'contains':
      return stringValue.includes(searchValue);
    case 'startsWith':
      return stringValue.startsWith(searchValue);
    case 'endsWith':
      return stringValue.endsWith(searchValue);
    case 'doesNotContain':
      return !stringValue.includes(searchValue);
    default:
      return false;
  }
};

/**
 * Apply number filter condition to a value
 */
const applyNumberFilter = (
  value: any,
  operator: string,
  filterValue: NumberFilterValue
): boolean => {
  if (value === null || value === undefined) return false;

  const numValue = Number(value);
  const filterNum = filterValue.value;

  if (isNaN(numValue) || isNaN(filterNum)) return false;

  switch (operator) {
    case 'equals':
      return numValue === filterNum;
    case 'greaterThan':
      return numValue > filterNum;
    case 'lessThan':
      return numValue < filterNum;
    case 'greaterThanOrEqual':
      return numValue >= filterNum;
    case 'lessThanOrEqual':
      return numValue <= filterNum;
    default:
      return false;
  }
};

/**
 * Apply date filter condition to a value
 */
const applyDateFilter = (
  value: any,
  operator: string,
  filterValue: DateFilterValue
): boolean => {
  if (value === null || value === undefined) return false;

  const dateValue = new Date(value);
  const startDate = new Date(filterValue.startDate);
  const endDate = new Date(filterValue.endDate);

  if (isNaN(dateValue.getTime()) || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false;
  }

  switch (operator) {
    case 'between':
      // Set time to start of day for startDate and end of day for endDate
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      return dateValue >= startDate && dateValue <= endDate;
    default:
      return false;
  }
};

/**
 * Apply amount filter condition to a value
 */
const applyAmountFilter = (
  value: any,
  operator: string,
  filterValue: AmountFilterValue
): boolean => {
  if (value === null || value === undefined) return false;

  const numValue = Number(value);
  const minAmount = filterValue.minAmount;
  const maxAmount = filterValue.maxAmount;

  if (isNaN(numValue) || isNaN(minAmount) || isNaN(maxAmount)) return false;

  switch (operator) {
    case 'between':
      return numValue >= minAmount && numValue <= maxAmount;
    default:
      return false;
  }
};

/**
 * Apply single select filter condition to a value
 */
const applySingleSelectFilter = (
  value: any,
  operator: string,
  filterValue: SingleSelectFilterValue
): boolean => {
  if (value === null || value === undefined) return false;

  const stringValue = String(value);
  const selectedValue = filterValue.value;

  switch (operator) {
    case 'is':
      return stringValue === selectedValue;
    case 'isNot':
      return stringValue !== selectedValue;
    default:
      return false;
  }
};

/**
 * Apply multi-select filter condition to a value (array field)
 */
const applyMultiSelectFilter = (
  value: any,
  operator: string,
  filterValue: MultiSelectFilterValue
): boolean => {
  if (!Array.isArray(value) || !Array.isArray(filterValue.values) || filterValue.values.length === 0) {
    return false;
  }

  switch (operator) {
    case 'in':
      // Check if the array contains ANY of the selected values
      return filterValue.values.some(selectedValue => value.includes(selectedValue));
    case 'notIn':
      // Check if the array contains NONE of the selected values
      return !filterValue.values.some(selectedValue => value.includes(selectedValue));
    default:
      return false;
  }
};

/**
 * Apply boolean filter condition to a value
 */
const applyBooleanFilter = (
  value: any,
  operator: string,
  filterValue: BooleanFilterValue
): boolean => {
  if (value === null || value === undefined) return false;

  switch (operator) {
    case 'is':
      return Boolean(value) === filterValue.value;
    default:
      return false;
  }
};

/**
 * Apply a single filter condition to an employee record
 */
const applyFilterCondition = (
  employee: Employee,
  condition: FilterCondition,
  fieldPath?: string
): boolean => {
  const path = fieldPath || condition.field;
  const fieldValue = getNestedValue(employee, path);

  switch (condition.fieldType) {
    case 'text':
      return applyTextFilter(fieldValue, condition.operator, condition.value as TextFilterValue);
    case 'number':
      return applyNumberFilter(fieldValue, condition.operator, condition.value as NumberFilterValue);
    case 'date':
      return applyDateFilter(fieldValue, condition.operator, condition.value as DateFilterValue);
    case 'amount':
      return applyAmountFilter(fieldValue, condition.operator, condition.value as AmountFilterValue);
    case 'singleSelect':
      return applySingleSelectFilter(fieldValue, condition.operator, condition.value as SingleSelectFilterValue);
    case 'multiSelect':
      return applyMultiSelectFilter(fieldValue, condition.operator, condition.value as MultiSelectFilterValue);
    case 'boolean':
      return applyBooleanFilter(fieldValue, condition.operator, condition.value as BooleanFilterValue);
    default:
      return false;
  }
};

/**
 * Filter employee data based on multiple filter conditions
 * Uses AND logic between different fields
 */
export const filterEmployees = (
  employees: Employee[],
  conditions: FilterCondition[],
  fieldPaths: Record<string, string> = {}
): Employee[] => {
  if (conditions.length === 0) {
    return employees;
  }

  return employees.filter(employee => {
    // All conditions must be satisfied (AND logic)
    return conditions.every(condition => {
      const fieldPath = fieldPaths[condition.field];
      return applyFilterCondition(employee, condition, fieldPath);
    });
  });
};

/**
 * Validate if a filter condition has complete and valid values
 */
export const isValidFilterCondition = (condition: FilterCondition): boolean => {
  try {
    switch (condition.fieldType) {
      case 'text': {
        const value = condition.value as TextFilterValue;
        return Boolean(value.value && value.value.trim().length > 0);
      }
      case 'number': {
        const value = condition.value as NumberFilterValue;
        return !isNaN(value.value);
      }
      case 'date': {
        const value = condition.value as DateFilterValue;
        const startDate = new Date(value.startDate);
        const endDate = new Date(value.endDate);
        return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && startDate <= endDate;
      }
      case 'amount': {
        const value = condition.value as AmountFilterValue;
        return !isNaN(value.minAmount) && !isNaN(value.maxAmount) && value.minAmount <= value.maxAmount;
      }
      case 'singleSelect': {
        const value = condition.value as SingleSelectFilterValue;
        return Boolean(value.value);
      }
      case 'multiSelect': {
        const value = condition.value as MultiSelectFilterValue;
        return Array.isArray(value.values) && value.values.length > 0;
      }
      case 'boolean': {
        const value = condition.value as BooleanFilterValue;
        return typeof value.value === 'boolean';
      }
      default:
        return false;
    }
  } catch {
    return false;
  }
};
