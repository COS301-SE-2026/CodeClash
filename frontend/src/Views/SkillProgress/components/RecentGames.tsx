import type React from 'react';
import type { GameMastery, MatchOutcome } from 'src/Models/SkillProgressModel';

interface RecentGamesProps {
    games: GameMastery[];
    ceiling: number;
}

const RESULT_BADGE: Record<MatchOutcome, string> = {
    WIN: 'badge-status-correct',
    LOSS: 'badge-status-wrong',
    DRAW: 'badge-status-pending'
};

const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })