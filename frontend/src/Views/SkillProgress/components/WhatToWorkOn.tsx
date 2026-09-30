import { ArrowDownRight, ArrowUpRight, ChevronDown, CircleAlert, Crosshair, Info, Minus, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import type { FocusReport, Insight, WeeklyChange } from 'src/Models/SkillInsights';

import InsightList from './InsightList';
import StatTile from './StatTile';

interface WhatToWorkOnProps {
    title: string;
    report: FocusReport;
    gamesAnalysed: number;
    emptyState: string;
}

const TONE_ICON: Record<Insight['tone'], React.ComponentType<{ size?: number; className?: string }>> = {
    good: TrendingUp,
    warn: CircleAlert,
    info: Info
};

const TONE_COLOUR: Record<Insight['tone'], string> = {
    good: 'text-success',
    warn: 'text-warning',
    info: 'text-muted-text'
};

const TONE_BADGE: Record<Insight['tone'], string> = {
    good: 'badge-status-correct',
    warn: 'badge-status-wrong',
    info: 'badge-status-pending'
};

const Sparkline: React.FC<{ series: number[] }> = ({ series }) => {
    if (series.length < 2) return null;
    const points = series
        .map((value, index) => `${(index / (series.length - 1)) * 100},${30 - (Math.min(100, Math.max(0, value)) / 100) * 28 - 1}`)
        .join(' ');
    return (
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-10" aria-hidden="true">
            <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        </svg>
    );
};

const NextStep: React.FC<{ action: string }> = ({ action }) => (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
        <p className="eyebrow text-primary">Next step</p>
        <p className="text-xsm text-primary-text mt-1.5 leading-snug">{action}</p>
    </div>
);

const FocusCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  const Icon = TONE_ICON[insight.tone];
    return (
        <div className="card-glow p-6 flex flex-col gap-5">
            <span className={`badge ${TONE_BADGE[insight.tone]}`}>
                <Crosshair size={12} />
                {insight.tone === 'warn' ? 'Your focus' : 'Your edge'}
            </span>

            <div>
                <div className="flex items-start gap-2">
                    <Icon size={20} className={`${TONE_COLOUR[insight.tone]} shrink-0 mt-0.5`} />
                    <h3 className="text-md font-black text-primary-text leading-tight">{insight.title}</h3>
                </div>
                <p className="text-xsm text-muted-text mt-2 leading-snug">{insight.body}</p>
            </div>

            {/*evidence uses the same tile as the headline figures on this page*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {insight.evidence.map(item => (
                    <StatTile key={item.label} label={item.label} value={item.value} />
                ))}
            </div>

            {insight.series && <Sparkline series={insight.series} />}
            {insight.action && <NextStep action={insight.action} />}
        </div>
    );
};