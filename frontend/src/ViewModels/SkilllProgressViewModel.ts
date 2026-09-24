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

export function useSkillProgressViewModel(): SkillProgressViewModel {
    const { token, isLoading: isAuthLoading } = useAuth();
    const { league, elo } = useUser();

    const [telemetry, setTelemetry] = useState<SkillTelemetry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [domain, setDomain] = useState<SkillDomain>('overall');

    useEffect(() => {
        if (isAuthLoading) return;

        // isLoading starts true and only ever flips off here, so there is no setState in
        // the effect body - the fetch owns the transition.
        let cancelled = false;

        loadSkillTelemetry(token ?? null, league)
            .then(result => {
                if (cancelled) return;
                setTelemetry(result);
                setError('');
            })
            .catch((err: unknown) => {
                if (cancelled) return;
                console.error('Error building skill progress:', err);
                setError('Could not load your skill progress right now.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [token, league, isAuthLoading]);

    /*Games for the selected domain, newest first. 'overall' keeps everything.*/
    const games = useMemo(() => {
        const all = telemetry?.games ?? [];
        return domain === 'overall' ? all : all.filter(game => game.domain === domain);
    }, [telemetry, domain]);

    const masteries = useMemo<GameMastery[]>(() => games.map(gameMastery), [games]);

    const mastery = useMemo(() => averageMastery(masteries), [masteries]);

    const growth = useMemo(() => growthFromReadings(growthReadings(masteries)), [masteries]);

    /*Components are per domain by definition - math and programming score different
    things - so 'overall' shows both sets stacked.*/
    const components = useMemo<ComponentScore[]>(() => {
        const all = telemetry?.games ?? [];
        const domains: GameDomain[] = domain === 'overall' ? ['math', 'programming'] : [domain];
        return domains.flatMap(target => componentScores(all, target));
    }, [telemetry, domain]);

    const bands = useMemo(() => difficultyBands(games, league), [games, league]);

    const winRate = useMemo(() => {
        const sampled = games.slice(0, MASTERY_WINDOW);
        if (sampled.length === 0) return 0;
        const wins = sampled.filter(game => game.result === 'WIN').length;
        return Math.round((wins / sampled.length) * 100);
    }, [games]);

    const insights = useMemo(
        () => buildInsights(components, growth, mastery, league),
        [components, growth, mastery, league]
    );

    return {
        content: skillProgressContent,
        isLoading: isLoading || isAuthLoading,
        error,
        domain,
        setDomain,
        mastery,
        masteryCeiling: masteryCeiling(league),
        growth,
        winRate,
        gamesAnalysed: Math.min(games.length, MASTERY_WINDOW),
        masteryWindow: MASTERY_WINDOW,
        league,
        elo,
        components,
        bands,
        recentGames: masteries.slice(0, 8),
        insights,
        isSimulated: games.some(game => game.simulated),
        telemetrySource: telemetry?.source ?? null
    };
}