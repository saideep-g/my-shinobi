import React from 'react';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { clsx } from 'clsx';

/**
 * TABLE MASTERY HEATMAP
 * Visualizes the 12x12 multiplication grid.
 * Colors represent Bayesian mastery probability for each fact.
 */

export const TableMasteryHeatmap: React.FC = () => {
    const { mastery } = useIntelligence();

    // The grid runs from 1 to 12
    const axis = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
            <header className="mb-8">
                <h3 className="text-xl font-black text-text-main">The Knowledge Grid</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Multiplication Mastery (1x1 – 12x12)</p>
            </header>

            <div className="overflow-x-auto custom-scrollbar pb-4">
                <div className="min-w-[600px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[40px_repeat(12,minmax(0,1fr))] gap-2 mb-2">
                        <div />
                        {axis.map(n => (
                            <div key={n} className="text-center text-[10px] font-black text-text-muted">{n}</div>
                        ))}
                    </div>

                    {/* Content Rows */}
                    {axis.map(row => (
                        <div key={row} className="grid grid-cols-[40px_repeat(12,minmax(0,1fr))] gap-2 mb-2">
                            <div className="flex items-center justify-center text-[10px] font-black text-text-muted">{row}</div>
                            {axis.map(col => {
                                // For this adaptive version, we group facts by their "Table" atom
                                // and slightly vary intensity by multiplier if we had per-fact mastery.
                                // Currently, atoms are table-wide (e.g., 'table-7').
                                const masteryVal = mastery[`table-${row}`] || 0.25;

                                return (
                                    <div
                                        key={col}
                                        className={clsx(
                                            "aspect-square rounded-xl border border-black/5 flex items-center justify-center transition-all duration-700 hover:scale-110 cursor-help group",
                                            masteryVal >= 0.85 && "bg-emerald-500 shadow-lg shadow-emerald-500/20",
                                            masteryVal >= 0.50 && masteryVal < 0.85 && "bg-amber-400 shadow-lg shadow-amber-400/20",
                                            masteryVal < 0.50 && "bg-rose-500 shadow-lg shadow-rose-500/20"
                                        )}
                                        title={`${row}x${col} Mastery: ${Math.round(masteryVal * 100)}%`}
                                    >
                                        <span className="text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            {row * col}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <footer className="mt-8 flex justify-center gap-6">
                <LegendItem label="Mastered" color="bg-emerald-500" range="> 85%" />
                <LegendItem label="Developing" color="bg-amber-400" range="50-84%" />
                <LegendItem label="Critical" color="bg-rose-500" range="< 50%" />
            </footer>
        </div>
    );
};

const LegendItem = ({ label, color, range }: { label: string, color: string, range: string }) => (
    <div className="flex items-center gap-2">
        <div className={clsx("w-3 h-3 rounded-full", color)} />
        <span className="text-[9px] font-black text-text-main uppercase tracking-tighter">{label}</span>
        <span className="text-[9px] font-bold text-text-muted">{range}</span>
    </div>
);
