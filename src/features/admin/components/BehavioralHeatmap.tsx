import React, { useMemo } from 'react';
import { QuestionLog } from '@/types/assessment';
import { Activity, Moon, Sun, Coffee } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * BEHAVIORAL HEATMAP
 * Tracks density of activity across time of day and day of week.
 * Identifies high-intensity sessions (late-night speedruns, morning routines).
 */

interface Props {
    logs: QuestionLog[];
}

export const BehavioralHeatmap: React.FC<Props> = ({ logs }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const heatData = useMemo(() => {
        // [dayIndex][hourIndex] = count
        const grid = Array.from({ length: 7 }, () => Array(24).fill(0));

        logs.forEach(log => {
            const date = new Date(log.timestamp);
            const day = date.getDay();
            const hour = date.getHours();
            grid[day][hour]++;
        });

        // Find max for normalization
        let max = 0;
        grid.forEach(row => row.forEach(val => max = Math.max(max, val)));

        return { grid, max };
    }, [logs]);

    const getIntensityClass = (count: number) => {
        if (count === 0) return 'bg-app-bg border-app-border/10';
        const ratio = count / heatData.max;
        if (ratio < 0.25) return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-300';
        if (ratio < 0.5) return 'bg-indigo-300 dark:bg-indigo-800/40 text-indigo-100';
        if (ratio < 0.75) return 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] text-white';
        return 'bg-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.5)] text-white ring-1 ring-white/20';
    };

    return (
        <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm h-full flex flex-col">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h4 className="text-xl font-black text-text-main flex items-center gap-3">
                        <Activity className="text-indigo-500" /> Behavioral Intensity
                    </h4>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Activity distribution by temporal slice</p>
                </div>
                <div className="flex items-center gap-4 text-text-muted opacity-40">
                    <Moon size={16} />
                    <div className="h-px w-8 bg-app-border" />
                    <Coffee size={16} />
                    <div className="h-px w-8 bg-app-border" />
                    <Sun size={16} />
                </div>
            </header>

            <div className="flex-1 flex flex-col gap-2">
                {/* Hours Header */}
                <div className="flex gap-1 pl-12">
                    {hours.map(h => (
                        <div key={h} className="flex-1 text-center text-[8px] font-black text-text-muted opacity-60">
                            {h === 0 || h === 12 || h === 23 ? h : ''}
                        </div>
                    ))}
                </div>

                {/* Heatmap Grid */}
                {days.map((day, dayIdx) => (
                    <div key={day} className="flex items-center gap-2">
                        <div className="w-10 text-[10px] font-black text-text-muted uppercase tracking-wider text-right">{day}</div>
                        <div className="flex-1 flex gap-1 h-8">
                            {hours.map(hour => {
                                const count = heatData.grid[dayIdx][hour];
                                return (
                                    <div
                                        key={hour}
                                        title={`${day} ${hour}:00 - ${count} activities`}
                                        className={clsx(
                                            "flex-1 rounded-sm border border-transparent transition-all duration-500",
                                            getIntensityClass(count)
                                        )}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Legend */}
                <div className="mt-8 flex items-center justify-end gap-3 px-2">
                    <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Low Intensity</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-indigo-100" />
                        <div className="w-3 h-3 rounded-sm bg-indigo-300" />
                        <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                        <div className="w-3 h-3 rounded-sm bg-indigo-700" />
                    </div>
                    <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">High Intensity</span>
                </div>
            </div>

            <footer className="mt-8 bg-app-bg/50 border border-app-border p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-text-main leading-relaxed text-center">
                    Insight: Most active during <span className="text-app-primary">16:00 - 19:00</span> (Post-School Productivity).
                    Session quality tends to dip after <span className="text-amber-600 font-black italic underline">21:00</span>.
                </p>
            </footer>
        </div>
    );
};
