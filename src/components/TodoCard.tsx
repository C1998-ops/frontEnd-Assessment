import React from 'react';
import { type Todo } from '../constants/types';
import { Button } from './ui';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-red-600 bg-red-100',
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      todo.completed ? 'border-green-500 bg-gray-50' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`mt-1 text-sm ${
                todo.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-3">
              {/* Priority */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[todo.priority]
              }`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
              
              {/* Due Date */}
              {todo.dueDate && (
                <span className="text-sm text-gray-500">
                  Due: {formatDate(todo.dueDate)}
                </span>
              )}
              
              {/* Tags */}
              {todo.tags.length > 0 && (
                <div className="flex space-x-1">
                  {todo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
              Created: {formatDate(todo.createdAt)}
              {todo.updatedAt !== todo.createdAt && (
                <span className="ml-2">
                  Updated: {formatDate(todo.updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-2 ml-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(todo)}
            disabled={todo.completed}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onDelete(todo.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;