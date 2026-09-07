import { useEffect, useState, createContext, useContext } from "react";
import type { ReactNode } from "react";

export type Theme = 'dark' | 'light';
const themeKey = 'codeclash-themes';

interface ThemeContextValue {
    theme: Theme;
    isLight: boolean;
    toggleTheme: () => void;
    setTheme: (theme : Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getDefTheme():Theme {
        if (typeof window === 'undefined') {
            return 'dark';
        }
        const stored = window.localStorage.getItem(themeKey);
        return stored === 'light' ? 'light' :'dark';
}

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle('light', theme === 'light');
}

export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [theme, setThemes] = useState<Theme>(getDefTheme);
    useEffect(() => {
        applyTheme(theme);
        window.localStorage.setItem(themeKey, theme);
    }, [theme])
    
    const toggleTheme = () => {
        setThemes((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

    const setTheme = (next: Theme) => setThemes(next);

    return (
        <ThemeContext.Provider value = {{theme, isLight: theme === 'light', toggleTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-component
export const useTheme = () : ThemeContextValue => {
    const cnt = useContext(ThemeContext);
    if(!cnt) {
        throw new Error('useTheme must be within a ThemeProvider')
    }
    return cnt;
}