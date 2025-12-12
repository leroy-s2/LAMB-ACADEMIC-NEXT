import { useEffect } from 'react';
import { useAppSelector } from '@/libs/redux/hooks';

export const useThemeEffect = () => {
    const theme = useAppSelector((state) => state.theme.current);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);
};

