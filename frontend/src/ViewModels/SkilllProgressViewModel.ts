import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'src/context/Auth/hooks/useAuth';
import { useUser } from 'src/context/User/hooks/useUser';
import type {
    ComponentScore,
    DifficultyBand,
    GameDomain,
    GameMastery,
    GrowthResult,
    Insight,
    SkillDomain,
    SkillProgressContent
} from 'src/Models/SkillProgressModel';
import {
    MASTERY_WINDOW,
    averageMastery,
    buildInsights,
    componentScores,
    difficultyBands,
    gameMastery,
    growthFromReadings,
    growthReadings,
    masteryCeiling,
    skillProgressContent
} from 'src/Models/SkillProgressModel';
import type { SkillTelemetry } from 'src/services/skill-progress.service';
import { loadSkillTelemetry } from 'src/services/skill-progress.service';

export interface SkillProgressViewModel {
    content: SkillProgressContent;
    isLoading: boolean;
    error: string;
    /*Filter state.*/
    domain: SkillDomain;
    setDomain: (domain: SkillDomain) => void;
    /*Headline figures.*/
    mastery: number;
    masteryCeiling: number;
    growth: GrowthResult;
    winRate: number;
    gamesAnalysed: number;
    masteryWindow: number;
    league: string;
    elo: number;
    /*Breakdowns.*/
    components: ComponentScore[];
    bands: DifficultyBand[];
    recentGames: GameMastery[];
    insights: Insight[];
    /*True while any of the numbers come from generated telemetry.*/
    isSimulated: boolean;
    telemetrySource: SkillTelemetry['source'] | null;
}