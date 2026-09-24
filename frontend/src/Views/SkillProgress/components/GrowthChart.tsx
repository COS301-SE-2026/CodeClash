import type React from 'react';
import { useMemo, useState } from 'react';
import type { GrowthResult } from 'src/Models/SkillProgressModel';
import { predictMastery } from 'src/Models/SkillProgressModel';

interface GrowthChartProps {
    growth: GrowthResult;
    ceiling: number;
}

const WIDTH = 620;
const HEIGHT = 260;
const PADDING = { top: 24, right: 24, bottom: 34, left: 44 };

const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;