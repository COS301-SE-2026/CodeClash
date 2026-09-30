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

    return (
            <div className="relative">
                <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label="Mastery over the growth window">
                    <defs>
                        <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
    
                    {chart.gridlines.map(gridline => (
                        <g key={gridline.y}>
                            <line
                                x1={PADDING.left}
                                x2={WIDTH - PADDING.right}
                                y1={gridline.y}
                                y2={gridline.y}
                                stroke="var(--border)"
                                strokeWidth={1}
                            />
                            <text
                                x={PADDING.left - 10}
                                y={gridline.y + 4}
                                textAnchor="end"
                                fontSize="11"
                                fill="var(--muted-text)"
                            >
                                {gridline.label}
                            </text>
                        </g>
                    ))}
    
                    {chart.points.length > 1 && (
                        <>
                            <polygon points={chart.area} fill="url(#growth-area)" />
                            <polyline
                                points={chart.line}
                                fill="none"
                                stroke="var(--primary)"
                                strokeWidth={2.5}
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                        </>
                    )}
    
                    {/*The least squares trend line - its slope is the Growth number.*/}
                    <line
                        x1={chart.trendStart.x}
                        y1={chart.trendStart.y}
                        x2={chart.trendEnd.x}
                        y2={chart.trendEnd.y}
                        stroke="var(--primary-text)"
                        strokeWidth={1.5}
                        strokeDasharray="6 6"
                        opacity={0.75}
                    />
    
                    {chart.points.map((point, index) => (
                        <circle
                            key={`${point.playedAt}-${index}`}
                            cx={point.cx}
                            cy={point.cy}
                            r={hovered === index ? 6 : 3.5}
                            fill={hovered === index ? 'var(--primary-text)' : 'var(--primary)'}
                            stroke="var(--background)"
                            strokeWidth={1.5}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
    
                    <text x={PADDING.left} y={HEIGHT - 10} fontSize="11" fill="var(--muted-text)">
                        {formatDay(chart.points[0]!.playedAt)}
                    </text>
                    <text x={WIDTH - PADDING.right} y={HEIGHT - 10} textAnchor="end" fontSize="11" fill="var(--muted-text)">
                        {formatDay(chart.points[chart.points.length - 1]!.playedAt)}
                    </text>
                </svg>
    
                {active && (
                    <div className="absolute top-2 right-2 rounded-xl border border-border bg-card px-3 py-2 backdrop-blur-md">
                        <p className="text-xsm font-bold text-primary-text">Mastery {active.mastery.toFixed(2)}</p>
                        <p className="text-xsm text-muted-text">{formatDay(active.playedAt)}</p>
                    </div>
                )}
    
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xsm text-muted-text">
                    <span className="flex items-center gap-2">
                        <span className="h-1.5 w-5 rounded-full bg-primary" />
                        <span>Mastery score after each game</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-px w-5 border-t-2 border-dashed border-primary-text opacity-70" />
                        <span>Least squares trend</span>
                    </span>
                    <span className="ml-auto">Fit r² {growth.fit.toFixed(2)}</span>
                </div>
            </div>
        );
    };
    
    export default GrowthChart;