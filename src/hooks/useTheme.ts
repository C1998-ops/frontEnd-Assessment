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
         table: currentTheme === 'dark' ? 'text-secondary' : 'text-primary',
         tableHeader: currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
         tableHeaderCell: currentTheme === 'dark' ? 'text-secondary' : 'text-primary',
         tableRow: currentTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
         tableCell: currentTheme === 'dark' ? 'text-secondary' : 'text-primary',
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
