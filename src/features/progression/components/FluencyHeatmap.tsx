import React, { useMemo } from 'react';
import { useProgression } from '@/core/engine/ProgressionContext';
import { clsx } from 'clsx';
import { Info } from 'lucide-react';

/**
 * FLUENCY HEATMAP (12x12)
 * Ported from Blue-Ninja-v2.
 * Visualizes multiplication fact mastery using a color grid.
 * MASTERED=Green, FLUENT=Light Green, REVIEW=Yellow, STRUGGLING=Red, WARNING=Dark Red
 */

export const FluencyHeatmap: React.FC = () => {
    const { stats } = useProgression();
    const config = stats.tablesConfig;

    const heatmapData = useMemo(() => {
        const grid: any[][] = [];
        for (let i = 1; i <= 12; i++) {
            const row = [];
            for (let j = 1; j <= 12; j++) {
                const atomId = `table-${i}-${j}`;
                const pb = config?.personalBests?.[atomId];
                const streak = config?.factStreaks?.[atomId] || 0;

                let status: 'LOCKED' | 'WARNING' | 'STRUGGLING' | 'REVIEW' | 'FLUENT' | 'MASTERED' = 'LOCKED';

                if (streak >= 5 && pb && pb < 2000) status = 'MASTERED';
                else if (streak >= 3 && pb && pb < 3000) status = 'FLUENT';
                else if (streak >= 1 && pb && pb < 5000) status = 'REVIEW';
                else if (streak === 0 && pb) status = 'STRUGGLING';
                else if (pb && pb > 10000) status = 'WARNING';

                row.push({ i, j, status, pb, streak });
            }
            grid.push(row);
        }
        return grid;
    }, [config]);

    const getColorClass = (status: string) => {
        switch (status) {
            case 'MASTERED': return 'bg-emerald-500 text-white';
            case 'FLUENT': return 'bg-emerald-300 text-emerald-900';
            case 'REVIEW': return 'bg-amber-300 text-amber-900';
            case 'STRUGGLING': return 'bg-rose-400 text-white';
            case 'WARNING': return 'bg-rose-700 text-white';
            default: return 'bg-app-bg text-text-muted opacity-20';
        }
    };

    return (
        <div className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm overflow-hidden">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-sm font-black flex items-center gap-2">
                        Fluency Heatmap <span className="text-[10px] text-indigo-500 font-bold px-2 py-0.5 bg-indigo-50 rounded-full">12x12</span>
                    </h3>
                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1">Real-time Speed & Accuracy Map</p>
                </div>
                <div className="flex gap-1">
                    {['#10b981', '#6ee7b7', '#fcd34d', '#fb7185', '#be123c'].map((color, idx) => (
                        <div key={idx} className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                </div>
            </header>

            <div className="grid grid-cols-13 gap-1 min-w-[300px]">
                {/* Header Row */}
                <div className="w-6 h-6" />
                {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="text-[8px] font-black text-text-muted text-center flex items-center justify-center">
                        {i + 1}
                    </div>
                ))}

                {heatmapData.map((row, idx) => (
                    <React.Fragment key={idx}>
                        <div className="text-[8px] font-black text-text-muted text-right pr-2 flex items-center justify-end">
                            {idx + 1}
                        </div>
                        {row.map((cell, cidx) => (
                            <div
                                key={cidx}
                                title={`${cell.i}x${cell.j}: ${cell.pb ? (cell.pb / 1000).toFixed(2) + 's' : 'N/A'}`}
                                className={clsx(
                                    "aspect-square rounded-sm transition-all hover:scale-125 hover:z-10 hover:shadow-lg cursor-help flex items-center justify-center",
                                    getColorClass(cell.status)
                                )}
                            >
                                {cell.status === 'MASTERED' && <div className="w-1 h-1 bg-white rounded-full opacity-50" />}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            <footer className="mt-6 pt-4 border-t border-app-border flex items-center gap-3">
                <Info size={14} className="text-app-primary" />
                <p className="text-[9px] font-medium text-text-muted italic">
                    Grid colors reflect speed and streak consistency across your last 50 attempts.
                </p>
            </footer>
        </div>
    );
};
