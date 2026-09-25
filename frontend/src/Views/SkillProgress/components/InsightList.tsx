import { CircleAlert, Info, TrendingUp } from 'lucide-react';
import type React from 'react';
import type { Insight } from 'src/Models/SkillProgressModel';

interface InsightListProps {
    insights: Insight[];
}

const ICONS: Record<Insight['tone'], React.ComponentType<{ size?: number; className?: string }>> = {
    good: TrendingUp,
    warn: CircleAlert,
    info: Info
};

const TONE_COLOUR: Record<Insight['tone'], string> = {
    good: 'text-success',
    warn: 'text-warning',
    info: 'text-muted-text'
};

const InsightList: React.FC<InsightListProps> = ({ insights }) => (
    <div className="flex flex-col gap-3">
        {insights.map(insight => {
            const Icon = ICONS[insight.tone];
            return (
                <div
                    key={insight.id}
                    className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
                >
                    <Icon size={18} className={`${TONE_COLOUR[insight.tone]} shrink-0 mt-0.5`} />
                    <div>
                        <p className="text-xsm font-bold text-primary-text leading-snug">{insight.title}</p>
                        <p className="text-xsm text-muted-text mt-1 leading-snug">{insight.body}</p>
                    </div>
                </div>
            );
        })}
    </div>
);

export default InsightList;