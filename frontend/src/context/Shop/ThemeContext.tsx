import { useEffect, useState, createContext, useContext } from "react";
import type { ReactNode } from "react";

export type Theme = 'dark' | 'light' | 'frost' | 'gold';
const themeKey = 'codeclash-themes';
const Themes: Theme[] = ['dark', 'light', 'frost', 'gold'];

interface ThemeContextValue {
    theme: Theme;
    isLight: boolean;
    toggleTheme: () => void;
    setTheme: (theme : Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
    return !!value && (Themes as string[]).includes(value);
}

function getDefTheme():Theme {
        if (typeof window === 'undefined') {
            return 'dark';
        }
        const stored = window.localStorage.getItem(themeKey);
        return isTheme(stored) ? stored : 'dark';
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    Themes.forEach((t) => root.classList.remove(t));
    if (theme !== 'dark') {
        root.classList.add(theme);
    }
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