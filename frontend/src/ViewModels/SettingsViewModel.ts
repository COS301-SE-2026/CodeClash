import { useTheme } from "src/context/ThemeContext";
import type { Theme } from "src/context/ThemeContext";

export interface ThemesContent {
    id: Theme;
    label: string;
    swatch: string; //this will be used for a preview of what the primary color for the theme is
}

const Themes: ThemesContent[] = [
    {
        id: 'dark',
        label: 'Cosmo',
        swatch: '#c0395a'
    },
    {
        id: 'light',
        label: 'Cosmo Light',
        swatch: '#c0395a'
    },
    {
        id: 'frost',
        label: 'Frost',
        swatch: '#2f8fe0'
    },
    {
        id: 'gold',
        label: 'Gold',
        swatch: '#d4af37'
    },
]

export const SettingsViewModelFunc = () => {
    const {isLight, toggleTheme, theme, setTheme} = useTheme();

    return {
        isLight,
        toggleTheme,
        theme,
        setTheme,
        themes: Themes
    }
}