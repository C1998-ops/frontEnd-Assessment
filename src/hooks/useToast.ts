import { useContext, useCallback, useMemo } from 'react';
import { ToastContext } from '../context/toast-context';
import { TOAST_TYPES, TOAST_POSITIONS } from '../constants/toast';

export const useToast = () => {
	const context = useContext(ToastContext);

	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider');
	}

	const addToastWithCleanup = useCallback(
		(message: any, type: string, duration: number) => {
			const toastId = context.addToast(message, type, duration);
			const timeoutId = setTimeout(() => {
				context.removeToast(toastId);
			}, duration);

			// Cleanup timeout if component unmounts
			return () => {
				clearTimeout(timeoutId);
			};
		},
		[context]
	);

	// Memoize the returned functions to prevent unnecessary re-renders
	const toastFunctions = useMemo(
		() => ({
			...context,
			success: (message: any, duration: number) =>
				addToastWithCleanup(message, TOAST_TYPES.SUCCESS, duration),
			error: (message: any, duration: number) =>
				addToastWithCleanup(message, TOAST_TYPES.ERROR, duration),
			info: (message: any, duration: number) =>
				addToastWithCleanup(message, TOAST_TYPES.INFO, duration),
			warning: (message: any, duration: number) =>
				addToastWithCleanup(message, TOAST_TYPES.WARNING, duration),
			POSITIONS: TOAST_POSITIONS,
			TYPES: TOAST_TYPES,
		}),
		[context, addToastWithCleanup]
	);

	return toastFunctions;
};
