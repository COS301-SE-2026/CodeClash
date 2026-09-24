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

const SkillProgress: React.FC = () => {
    const {
        content,
        isLoading,
        error,
        domain,
        setDomain,
        mastery,
        masteryCeiling,
        growth,
        winRate,
        gamesAnalysed,
        masteryWindow,
        league,
        elo,
        components,
        bands,
        recentGames,
        insights,
        isSimulated,
        telemetrySource
    } = useSkillProgressViewModel();

    if (isLoading) {
        return <Loading isOpen={isLoading} />;
    }

    const masteryPercentage = masteryCeiling === 0 ? 0 : (mastery / masteryCeiling) * 100;
    const growthLabel = `${growth.growth >= 0 ? '+' : ''}${growth.growth.toFixed(2)}`;
    // Same thresholds as the growth insight, so the badge and the sentence always agree.
    const growthTrend =
        growth.growth > GROWTH_FLAT_THRESHOLD
            ? { label: 'Climbing', badge: 'badge-status-correct' }
            : growth.growth < -GROWTH_FLAT_THRESHOLD
              ? { label: 'Slipping', badge: 'badge-status-wrong' }
              : { label: 'Flat', badge: 'badge-status-pending' };