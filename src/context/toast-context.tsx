import React, { createContext, useContext } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: string;
  duration: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  position: string;
  addToast: (message: string, type?: string, duration?: number) => string;
  removeToast: (id: string) => void;
  updatePosition: (newPosition: string) => void;
  clearAllToasts: () => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

