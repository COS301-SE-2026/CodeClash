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
    scroll?: boolean;
}> = ({ title, hint, icon, action, children, className, scroll }) => (
    <div className={`card-elevated p-6 flex flex-col gap-4 ${scroll ? 'xl:h-0 xl:min-h-full' : ''} ${className ?? ''}`}>
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
        {scroll ? <div className="flex-1 min-h-0 overflow-y-auto pr-1">{children}</div> : children}
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
        growth.growth > GROWTH_FLAT_THRESHOLD ? { label: 'Climbing', badge: 'badge-status-correct' } : growth.growth < -GROWTH_FLAT_THRESHOLD ? { label: 'Slipping', badge: 'badge-status-wrong' } : { label: 'Flat', badge: 'badge-status-pending' };
    


return (
<div className="relative w-full min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
            <Starfield count={30} />

            <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col gap-6">
                {/*header section !!*/}
                <div className="card-elevated p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                        <p className="eyebrow text-primary">{content.eyebrow}</p>
                        <h1 className="text-xl font-black text-primary-text mt-1">{content.title}</h1>
                        <p className="text-xsm text-muted-text mt-1">{content.subtitle}</p>
        </div>

        <div className="flex flex-col items-start lg:items-end gap-3">
          {/*still top section but now adding extra information*/}
            <DomainToggle domain={domain} onChange={setDomain} />
            <div className="flex flex-wrap items-center gap-2">
                {league && <span className="badge badge-status-correct uppercase">{league} league</span>}
                <span className="badge badge-status-pending">Elo {elo}</span>
                <span className="badge badge-status-pending">Last {masteryWindow} games</span>
            </div>
        </div>
      </div>

      {/*error stuff along with telematry source and simulated items*/}
      {error && <div className="card-elevated p-4 text-xsm text-danger">{error}</div>}

      {isSimulated && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
              <Sparkles size={16} className="text-warning shrink-0" />
              <p className="text-xsm text-muted-text">
                  {telemetrySource === 'simulated' ? content.sampleNote : content.simulatedNote}
              </p>
          </div>
      )}

      {/*headlining figures in the page to be used*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatTile
              label={content.masteryTitle}
              value={mastery.toFixed(2)}
              unit={`/ ${masteryCeiling.toFixed(0)}`}
              caption={content.masteryHint}
              icon={<Brain size={16} />}
              progress={masteryPercentage}
        />
        {/*beginning of the state tiles to show the information n stuff*/}
          <StatTile
              label={content.growthTitle}
              value={growthLabel}
                              unit="/ week"
                              caption={`Slope of the trend line across the last ${growth.windowDays} days.`}
                              icon={<TrendingUp size={16} />}
                              badge={<span className={`badge ${growthTrend.badge}`}>{growthTrend.label}</span>}
                          />
                          <StatTile
                              label="Games Analysed"
                              value={`${gamesAnalysed}`}
                              unit={`of ${masteryWindow}`}
                              caption="Mastery averages the most recent games in this window."
                              icon={<Layers size={16} />}
                              progress={(gamesAnalysed / masteryWindow) * 100}
                          />
                          <StatTile
                              label="Win Rate"
                              value={`${winRate}`}
                              unit="%"
                              caption="Across the same window, for context against mastery."
                              icon={<Target size={16} />}
                              progress={winRate}
                          />
      </div>

      {/*growht section, seperated into sections for the chart and section items*/}
                      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-6 ">
                          <SectionCard
                              title={content.growthTitle}
                              hint={content.growthHint}
                              icon={<Activity size={18} className="text-primary" />}
                              action={
                                  <span className="badge badge-status-pending whitespace-nowrap">
                                      {growthLabel} mastery / week
                                  </span>
                              }
                          >
                              <GrowthChart growth={growth} ceiling={masteryCeiling} />
                          </SectionCard>
      {/*component bars to see mastery based on overall domain*/}
                          <SectionCard
                              title={content.componentsTitle}
          hint={content.componentsHint}
          scroll
          icon={<Gauge size={18} className="text-primary" />}
          
                          >
                              <ComponentBars components={components} grouped={domain === 'overall'} />
                          </SectionCard>
      </div>
      {/*show of the difficultiy split and difficulty sections*/}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 ">
          <SectionCard
              title={content.difficultyTitle}
              hint={content.difficultyHint}
              icon={<Layers size={18} className="text-primary" />}
          >
              <DifficultyBands bands={bands} />
          </SectionCard>

          <SectionCard
              title={content.gamesTitle}
          hint={content.gamesHint}
          scroll
              icon={<Activity size={18} className="text-primary" />}
          >
              <RecentGames games={recentGames} ceiling={masteryCeiling} />
          </SectionCard>

          <SectionCard
              title={content.insightsTitle}
              scroll
              icon={<Sparkles size={18} className="text-primary" />}
          >
              <InsightList insights={insights} />
          </SectionCard>
      </div>
  </div>
</div>
);
};
      

        
    


export default SkillProgress;