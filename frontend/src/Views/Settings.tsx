import React from "react";
import { SettingsViewModelFunc } from "src/ViewModels/SettingsViewModel";

const Settings: React.FC = () => {
    const {isLight, toggleTheme} = SettingsViewModelFunc();

    return (
        <div>

        </div>
    )
}

export default Settings;