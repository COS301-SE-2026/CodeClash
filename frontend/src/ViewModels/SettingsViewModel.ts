import { useTheme } from "src/context/ThemeContext";

export const SettingsViewModelFunc = () => {
    const {isLight, toggleTheme} = useTheme();

    return {
        isLight,
        toggleTheme
    }
}