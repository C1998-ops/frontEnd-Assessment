export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface CreateTodoInput {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
  completed?: boolean;
}

export interface TodoFilter {
  status: 'all' | 'completed' | 'pending';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  tags?: string[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
  addTodo: (todo: CreateTodoInput) => Promise<void>;
  updateTodo: (id: string, updates: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  getTodoById: (id: string) => Todo | undefined;
  clearCompleted: () => Promise<void>;
}

export interface SidebarItem {
  id: string;
  path: string;
  label: string;
  tooltip?: string;
  icon: React.ReactNode;
}
export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export interface TopNavItems {
  id: string;
  path: string;
  label: string;
}
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (value: any, row: T, index: any, onAction?: (...args: any[]) => void) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  filter?: {
    type: 'text' | 'select' | 'date';
    options?: Array<string>;
    placeholder?: string;
  };
  headerRender?: () => React.ReactNode;
}

export interface ExpandableRowConfig<T = any> {
  isExpanded: (row: T) => boolean;
  expandedRowRenderer: (row: T) => React.ReactNode;
  onToggleExpanded: (row: T) => void;
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'composite'
  | 'section'
  | 'multiselect'
  | 'file'
  | 'composite-address'
  | 'composite-row'
  | 'new-custom-composite'
  | 'composite-csv'
  | 'link'
  | 'date'
  | 'button'
  | 'custom-location-handler'
  | 'custom-eligibility-handler'
  | 'list'
  | 'businessHours'
  | 'tel'
  | 'grouped-list'
  | 'independent-list';

export type FormInputValue =
  | string
  | number
  | boolean
  | Record<string, any>
  | {
    [key: `eligibility_questions[${number}].question_text`]: string;
    [key: `eligibility_questions[${number}].question_answer`]: string;
  }
  | string[]
  | any[]
  | undefined;
export type ValidationRule = {
  checkDuplicate?: {
    message: string;
  };
  pattern?: {
    value: RegExp | boolean | string;
    message: string;
  };
  matchesName?: {
    message: string;
  };
  phoneValidation?: {
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  length?: {
    value: number;
    message: string;
  };
  date?: {
    message: string
  }
};
export interface RadioOptions {
  label: string;
  value: string | boolean;
}
export const LayoutTypes = {
  KEY_VALUE: 'key-value',
  TEXT: 'text',
  DEFAULT: 'default',
} as const;

export type LayoutTypes = typeof LayoutTypes[keyof typeof LayoutTypes];
//for field types in OptionConfig
export interface FieldTypes {
  key: string;
  valuePath: string;
  type?: FormFieldType | string;
  fields?: FormField[];
  options?: RadioOptions[] | string[];
  iconPath?: React.ReactNode | React.FC<any> | string;
  displayText?: string;
  label?: string;
  name?: string;
  isTitle?: boolean;
  defaultValue?: any;
  required?: boolean;
  placeholder?: string;
  layout?: LayoutTypes;
  editable?: boolean;
  primaryField?: string; // For grouped-list fields to determine visibility
  conditionalField?: boolean; // Marks a field as controlling visibility of other fields
  showWhen?: string; // Path to the field that controls visibility
  showWhenValue?: string | boolean; // Value that should trigger showing this field0
  clearAllOnFalse?: boolean; // Clear dependent field values when controlling field is false
  validation?: ValidationRule;
  renderAsText?: boolean; // Indicates if field should be rendered as single text line instead of bullet points
  inputMask?: string;
}
import React from 'react';

export interface FormField {
  name?: string;
  label?: string | React.ReactElement;
  group?: string; // For grouping fields together,
  value?: string | number | boolean | Record<string, any>;
  type?: FormFieldType;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>; // Use `any` if the options can have a dynamic structure
  required?: boolean;
  fields?: FormField[] | undefined; // For composite fields, like address or name,
  layout?: string; // For layout purposes, like grid or flex
  [key: string]: any; // For additional properties
  formErrors?: string | null; // For error messages
  component?: React.FC; // For custom components,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // For handling changes
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; // For handling blur events
  key?: string | number | undefined;
  className?: string | undefined;
  day_of_week?: string; //only for business hours table
  readOnly?: boolean;
  validation?: ValidationRule;
  renderAsText?: boolean; // Indicates if field should be rendered as single text line instead of bullet points
}