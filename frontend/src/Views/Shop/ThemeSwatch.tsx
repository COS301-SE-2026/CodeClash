//shops 'theme' tab

import React from "react";

interface ThemeSwatchProps {
    colors: string[];
    size?: number;
}

const ThemeSwatch:React.FC<ThemeSwatchProps> = ({colors, size = 44}) => {
    const step = 100/colors.length;
    const stops = colors.map((color, i) => `${color} ${i * step}% ${(i +1) * step}%`).join(', ');

    return (
        <div style={{width: size, height: size, borderRadius: '999px', background: `conic-gradient(${stops})`, border: '1px solid var(--border)', flexShrink: 0}}/>
    )
}

export default ThemeSwatch;