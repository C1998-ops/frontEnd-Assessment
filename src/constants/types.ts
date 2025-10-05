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
