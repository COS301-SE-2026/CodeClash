import type React from 'react';

interface StatTileProps {
    label: string;
    value: string;
    unit?: string;
    caption?: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    /*0-100. Leave undefined for figures without a natural maximum.*/
    progress?: number;
}

