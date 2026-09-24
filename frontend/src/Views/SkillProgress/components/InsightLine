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