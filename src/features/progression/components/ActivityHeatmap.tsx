import React from 'react';
import { clsx } from 'clsx';

/**
 * ACTIVITY HEATMAP
 * Visualizes student engagement over time.
 * Logic: Every session creates a log entry. We count logs per day.
 */

interface ActivityHeatmapProps {
    data?: { date: string, count: number }[]; // In a real app, this comes from ProgressionContext
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data = [] }) => {
    // Generate data for the last 12 weeks
    const generateWeeks = () => {
        const isDemo = data.length === 0;
        const weeks = [];
        for (let w = 0; w < 12; w++) {
            const days = [];
            for (let d = 0; d < 7; d++) {
                // Random intensity for demo if no data provided
                days.push(isDemo ? Math.floor(Math.random() * 5) : 0);
            }
            weeks.push(days);
        }
        return weeks;
    };

    const weeks = generateWeeks();

    return (
        <div className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm overflow-hidden">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-sm font-black text-text-main">Practice Consistency</h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Training sessions (Last 12 Weeks)</p>
                </div>
                <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(v => (
                        <div key={v} className={clsx("w-3 h-3 rounded-sm", intensityClass(v))} />
                    ))}
                </div>
            </header>

            <div className="overflow-x-auto custom-scrollbar pb-2">
                <div className="flex gap-1.5 min-w-max">
                    {weeks.map((days, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-1.5">
                            {days.map((intensity, dIndex) => (
                                <div
                                    key={dIndex}
                                    title={`Intensity: ${intensity}`}
                                    className={clsx(
                                        "w-4 h-4 rounded-[4px] transition-all duration-500 hover:ring-2 hover:ring-app-primary/30 cursor-pointer",
                                        intensityClass(intensity)
                                    )}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between mt-4 text-[9px] font-black text-text-muted uppercase tracking-tighter opacity-50">
                <span>3 Months Ago</span>
                <span>Today</span>
            </div>
        </div>
    );
};

const intensityClass = (val: number) => {
    if (val === 0) return "bg-app-bg";
    if (val === 1) return "bg-app-primary/20";
    if (val === 2) return "bg-app-primary/40";
    if (val === 3) return "bg-app-primary/70";
    return "bg-app-primary";
};
