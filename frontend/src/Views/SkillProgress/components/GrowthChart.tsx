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

const formatDay = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-UK', { month: 'short', day: 'numeric' });

const GrowthChart: React.FC<GrowthChartProps> = ({ growth, ceiling }) => {
    const [hovered, setHovered] = useState<number | null>(null);

    const chart = useMemo(() => {
        const readings = growth.readings;
        // Always scale against the league ceiling so the shape is honest, but leave a
        // little headroom if a reading somehow sits above it.
        const maxMastery = Math.max(ceiling, ...readings.map(reading => reading.mastery), 1) * 1.05;

        const x = (day: number) => PADDING.left + (day / growth.windowDays) * PLOT_WIDTH;
        const y = (mastery: number) => PADDING.top + PLOT_HEIGHT - (mastery / maxMastery) * PLOT_HEIGHT;

        const points = readings.map(reading => ({
            ...reading,
            cx: x(reading.day),
            cy: y(reading.mastery)
        }));

        const line = points.map(point => `${point.cx.toFixed(1)},${point.cy.toFixed(1)}`).join(' ');
        const baseline = PADDING.top + PLOT_HEIGHT;
        const area =
            points.length > 1
                ? `${points[0]!.cx.toFixed(1)},${baseline} ${line} ${points[points.length - 1]!.cx.toFixed(1)},${baseline}`
                : '';

        // The regression line, drawn right across the window.
        const trendStart = { x: x(0), y: y(Math.max(0, predictMastery(growth, 0))) };
        const trendEnd = {
            x: x(growth.windowDays),
            y: y(Math.max(0, predictMastery(growth, growth.windowDays)))
        };

        const gridlines = [0, 0.25, 0.5, 0.75, 1].map(step => ({
            y: PADDING.top + PLOT_HEIGHT - step * PLOT_HEIGHT,
            label: (maxMastery * step).toFixed(1)
        }));

        return { points, line, area, trendStart, trendEnd, gridlines };
    }, [growth, ceiling]);

    if (chart.points.length === 0) {
        return (
            <div className="flex h-[260px] items-center justify-center text-xsm text-muted-text">
                No games inside the last {growth.windowDays} days yet.
            </div>
        );
    }

    const active = hovered === null ? null : chart.points[hovered];

