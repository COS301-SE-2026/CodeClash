//Setting page view model - will toggle light and dark mode from here for now, later on will add other controls like maybe notifications, sounds etc

import { useEffect, useState } from "react";

export type Theme = 'dark' | 'light';
const themeKey = 'codeclash-themes';

export const SettingsViewModelFunc = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') {
            return 'dark';
        }
        const stored = window.localStorage.getItem(themeKey) as Theme | null;
        return stored ?? 'dark';
    })

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'light') {
            root.classList.add('light');
        }
        else {
            root.classList.remove('light');
        }
    }, [theme])
    
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

    return {
        theme,
        isLight: theme === 'light',
        toggleTheme,
    }
}