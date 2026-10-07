import { useEffect, useState, createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useInventory } from "src/context/Shop/InventoryContext";

export type Theme = 'dark' | 'light' | 'frost' | 'gold' |'nebula' | 'verdant';
const themeKey = 'codeclash-themes';
const Themes: Theme[] = ['dark', 'light', 'frost', 'gold', 'nebula', 'verdant'];

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
    root.classList.add(theme);
}

export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [selectedTheme, setThemes] = useState<Theme>(getDefTheme);
    const { user, isLoading } = useAuth();
    const { catalog, inventory } = useInventory();

    // The server's equipped theme is the source of truth; localStorage only avoids a flash on load
    const equippedItem = user && inventory?.equippedThemeId
        ? catalog.find((i) => i.category === 'theme' && i.id === inventory.equippedThemeId)
        : undefined;
    const equippedThemeKey = equippedItem && 'themeId' in equippedItem ? equippedItem.themeId : null;

    // Adopt the equipped theme whenever it changes (adjusting state during render rather than in an effect)
    const [syncedThemeKey, setSyncedThemeKey] = useState<string | null>(null);
    if (equippedThemeKey !== syncedThemeKey) {
        setSyncedThemeKey(equippedThemeKey);
        if (isTheme(equippedThemeKey)) setThemes(equippedThemeKey);
    }

    // Only treat the user as logged out once auth has finished loading, otherwise every reload wipes the theme
    const loggedOut = !isLoading && user === null;
    const theme: Theme = loggedOut ? 'dark' : selectedTheme;

    useEffect(() => {
        applyTheme(theme);
        if (loggedOut) window.localStorage.removeItem(themeKey);
        else window.localStorage.setItem(themeKey, theme);
    }, [theme, loggedOut])

    const toggleTheme = () => {
        setThemes((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }

    // Ignore keys without a matching CSS theme class (callers may pass shop metadata through a cast)
    const setTheme = (next: Theme) => {
        if (isTheme(next)) setThemes(next);
    };

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