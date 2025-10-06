import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export const useTheme = () => {
    const { currentTheme, themes } = useSelector((state: RootState) => state.theme);
    const currentThemeConfig = themes[currentTheme as keyof typeof themes];

    const getThemeStyles = () => ({
        container: {
            backgroundColor: currentThemeConfig.backgroundColor,
            color: currentThemeConfig.textColor,
        },
        card: {
            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
            color: currentThemeConfig.textColor,
            border: currentTheme === 'dark' ? '1px solid #374151' : 'none',
        },
        text: {
            color: currentThemeConfig.textColor,
        },
        primary: {
            color: currentThemeConfig.primaryColor,
        },
    });

     const getTableClasses = () => ({
         table: `responsive-table w-full min-w-full ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`,
         tableHeader: currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
         tableHeaderCell: `px-6 py-4 text-left font-semibold text-sm align-middle border-b border-gray-200 ${currentTheme === 'dark' ? 'text-gray-200 border-gray-700' : 'text-gray-700 border-gray-200'}`,
         tableBody: 'text-sm',
         tableRow: `border-b border-gray-200 ${currentTheme === 'dark' ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-100'} transition-colors duration-150`,
         tableCell: `px-6 py-4 align-middle relative ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`,
         pagination: `px-6 py-4 bg-gray-50 ${currentTheme === 'dark' ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`,
         tableContainer: 'rounded-lg shadow-lg border overflow-hidden',
         tableWrapper: 'overflow-x-auto',
     });

    return {
        currentTheme,
        currentThemeConfig,
        isDark: currentTheme === 'dark',
        isLight: currentTheme === 'light',
        getThemeStyles,
        getTableClasses,
    };
};
