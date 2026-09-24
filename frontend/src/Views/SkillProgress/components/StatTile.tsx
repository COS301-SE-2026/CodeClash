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

const StatTile: React.FC<StatTileProps> = ({ label, value, unit, caption, icon, badge, progress }) => (
    <div className="card-elevated p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-text">
                {icon}
                <p className="text-xsm uppercase tracking-wide font-bold">{label}</p>
            </div>
            {badge}
        </div>

        <div className="flex items-end gap-2">
            <p className="score-display text-4xl font-black leading-none">{value}</p>
            {unit && <span className="text-xsm text-muted-text mb-1">{unit}</span>}
        </div>

        {progress !== undefined && (
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
            </div>
        )}

        {caption && <p className="text-xsm text-muted-text leading-snug">{caption}</p>}
    </div>
);

export default StatTile;