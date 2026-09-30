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