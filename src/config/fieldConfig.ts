import type { FieldConfig } from '../types';

/**
 * Field configuration defines all filterable fields in the employee dataset.
 * Each field specifies its type, available operators, and any additional metadata.
 */
export const FIELD_CONFIGS: FieldConfig[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  {
    key: 'department',
    label: 'Department',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    options: ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Product', 'Design'],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  {
    key: 'salary',
    label: 'Salary',
    type: 'amount',
    operators: ['between'],
  },
  {
    key: 'joinDate',
    label: 'Join Date',
    type: 'date',
    operators: ['between'],
  },
  {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean',
    operators: ['is'],
  },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiSelect',
    operators: ['in', 'notIn'],
    options: [
      'React', 'TypeScript', 'Node.js', 'GraphQL', 'Python', 'AWS', 'Docker',
      'Kubernetes', 'JavaScript', 'HTML', 'CSS', 'Java', 'Spring Boot',
      'PostgreSQL', 'MongoDB', 'SQL', 'Terraform', 'Linux', 'Jenkins',
      'SEO', 'Content Marketing', 'Analytics', 'Social Media', 'Excel',
      'Figma', 'User Research', 'Prototyping', 'Agile', 'Scrum',
    ],
  },
  {
    key: 'address.city',
    label: 'City',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
    path: 'address.city',
  },
  {
    key: 'address.state',
    label: 'State',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    path: 'address.state',
    options: [
      'CA', 'NY', 'TX', 'FL', 'WA', 'IL', 'MA', 'CO', 'OR', 'GA',
      'PA', 'AZ', 'NC', 'IN', 'OH', 'TN', 'MD', 'WI', 'NM', 'NE',
      'MO', 'VA', 'KY', 'AK', 'NV'
    ],
  },
  {
    key: 'address.country',
    label: 'Country',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    path: 'address.country',
    options: ['USA'],
  },
  {
    key: 'projects',
    label: 'Number of Projects',
    type: 'number',
    operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  },
  {
    key: 'lastReview',
    label: 'Last Review Date',
    type: 'date',
    operators: ['between'],
  },
  {
    key: 'performanceRating',
    label: 'Performance Rating',
    type: 'number',
    operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  },
];

/**
 * Helper function to get field configuration by key
 */
export const getFieldConfig = (key: string): FieldConfig | undefined => {
  return FIELD_CONFIGS.find(config => config.key === key);
};
