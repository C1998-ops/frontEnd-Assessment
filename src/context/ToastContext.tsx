import React, {
  type ReactNode,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { ToastContext } from "./toast-context";
import { TOAST_POSITIONS, TOAST_TYPES } from "../constants/toast";

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

export interface ToastProviderProps {
  children: ReactNode;
  defaultPosition?: string;
}

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 5;

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  defaultPosition = TOAST_POSITIONS.BOTTOM_CENTER,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [position, setPosition] = useState<string>(defaultPosition);
  const toastQueue = useRef<Toast[]>([]);
  const isProcessing = useRef(false);

  const processQueue = useCallback(() => {
    if (isProcessing.current || toastQueue.current.length === 0) return;

    isProcessing.current = true;
    const toast = toastQueue.current[0];

    setToasts((prev) => {
      const updatedToasts = prev.length >= MAX_TOASTS ? prev.slice(1) : prev;
      return [...updatedToasts, toast];
    });

    toastQueue.current = toastQueue.current.slice(1);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      isProcessing.current = false;
      processQueue();
    }, toast.duration);
  }, []);

  const addToast = useCallback(
    (
      message: string,
      type: string = TOAST_TYPES.SUCCESS,
      duration: number = DEFAULT_DURATION
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast = { id, message, type, duration };

      toastQueue.current.push(toast);
      processQueue();

      return id;
    },
    [processQueue]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    toastQueue.current = toastQueue.current.filter((toast) => toast.id !== id);
  }, []);

  const updatePosition = useCallback((newPosition: string) => {
    if (Object.values(TOAST_POSITIONS).includes(newPosition as any)) {
      setPosition(newPosition);
    }
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
    toastQueue.current = [];
    isProcessing.current = false;
  }, []);

  useEffect(() => {
    return () => {
      clearAllToasts();
    };
  }, [clearAllToasts]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      toasts,
      position,
      addToast,
      removeToast,
      updatePosition,
      clearAllToasts,
    }),
    [toasts, position, addToast, removeToast, updatePosition, clearAllToasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};
