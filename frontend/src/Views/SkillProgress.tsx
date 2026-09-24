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