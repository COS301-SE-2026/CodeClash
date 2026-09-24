import { Activity, Brain, Gauge, Layers, Sparkles, Target, TrendingUp } from 'lucide-react';
import type React from 'react';

import { GROWTH_FLAT_THRESHOLD } from '../Models/SkillProgressModel';
import { useSkillProgressViewModel } from '../ViewModels/SkillProgressViewModel';

import ComponentBars from './SkillProgress/components/ComponentBars';
import DifficultyBands from './SkillProgress/components/DifficultyBands';
import DomainToggle from './SkillProgress/components/DomainToggle';
import GrowthChart from './SkillProgress/components/GrowthChart';
import InsightList from './SkillProgress/components/InsightList';
import RecentGames from './SkillProgress/components/RecentGames';
import StatTile from './SkillProgress/components/StatTile';

import Loading from '@/components/shared/Loading';
import Starfield from '@/components/ui/animations/Starfield';

const SectionCard: React.FC<{
    title: string;
    hint?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}> = ({ title, hint, icon, action, children, className }) => (
    <div className={`card-elevated p-6 flex flex-col gap-4 ${className ?? ''}`}>
        <div className="flex items-start justify-between gap-3">
            <div>
                <div className="flex items-center gap-2">
                    {icon}
                    <h2 className="text-sm font-black text-primary-text">{title}</h2>
                </div>
                {hint && <p className="text-xsm text-muted-text mt-1 leading-snug">{hint}</p>}
            </div>
            {action}
        </div>
        {children}
    </div>
);