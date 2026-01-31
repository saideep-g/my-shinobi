import React, { useState } from 'react';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { clsx } from 'clsx';
import { X, Info } from 'lucide-react';

/**
 * FLUENCY HEATMAP
 * A 20x20 visualization of all multiplication facts.
 * Provides granular mastery feedback for every specific fact.
 */

export const FluencyHeatmap: React.FC = () => {
    const { mastery } = useIntelligence();
    const axis = Array.from({ length: 12 }, (_, i) => i + 1); // Using 12 for now as our curriculum is 12x12
    const [selectedCell, setSelectedCell] = useState<{ r: number, c: number } | null>(null);

    const getMasteryColor = (r: number, c: number) => {
        const factHash = `hash-${r}x${c}-fact`;
        const mVal = mastery[factHash];

        if (mVal === undefined) return 'bg-app-bg border-app-border opacity-20'; // Not tested
        if (mVal >= 0.85) return 'bg-emerald-500 shadow-sm shadow-emerald-500/20'; // Mastered
        if (mVal >= 0.70) return 'bg-amber-400'; // Developing
        return 'bg-rose-500'; // Struggles
    };

    return (
        <div className="bg-app-surface border border-app-border rounded-[32px] p-6 space-y-4">
            <header className="flex justify-between items-center">
                <div>
                    <h3 className="text-sm font-black text-text-main uppercase tracking-widest">Fluency Heatmap</h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">1x1 to 12x12 Knowledge Matrix</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black text-text-muted uppercase">Stable</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-[8px] font-black text-text-muted uppercase">Drill</span>
                    </div>
                </div>
            </header>

            {/* 12x12 Grid Container */}
            <div className="overflow-x-auto pb-4">
                <div className="inline-grid grid-cols-13 gap-1 min-w-[400px]">
                    {/* Header Corner */}
                    <div className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-text-muted">×</div>
                    {/* Top Axis */}
                    {axis.map(c => (
                        <div key={c} className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-text-muted">{c}</div>
                    ))}

                    {/* Rows */}
                    {axis.map(r => (
                        <React.Fragment key={r}>
                            {/* Left Axis */}
                            <div className="w-8 h-8 flex items-center justify-center text-[10px] font-black text-text-muted">{r}</div>
                            {/* Fact Cells */}
                            {axis.map(c => (
                                <button
                                    key={`${r}-${c}`}
                                    onClick={() => setSelectedCell({ r, c })}
                                    className={clsx(
                                        "w-8 h-8 rounded-lg transition-all duration-300 hover:scale-125 hover:z-10 focus:outline-none focus:ring-2 focus:ring-app-primary",
                                        getMasteryColor(r, c)
                                    )}
                                    title={`${r} × ${c}`}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Detail Panel (Conditional) */}
            {selectedCell && (
                <div className="mt-4 p-4 bg-app-bg/50 border border-app-border rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 relative">
                    <button
                        onClick={() => setSelectedCell(null)}
                        className="absolute top-3 right-3 text-text-muted hover:text-text-main"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-app-surface rounded-xl flex items-center justify-center text-xl font-black text-text-main shadow-sm border border-app-border">
                            {selectedCell.r}×{selectedCell.c}
                        </div>
                        <div>
                            <p className="text-xl font-black text-text-main line-clamp-none">
                                Result: {selectedCell.r * selectedCell.c}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Mastery Status:</span>
                                <span className="text-[10px] font-black text-app-primary uppercase">
                                    {mastery[`hash-${selectedCell.r}x${selectedCell.c}-fact`]
                                        ? `${Math.round(mastery[`hash-${selectedCell.r}x${selectedCell.c}-fact`] * 100)}% Precision`
                                        : "Not Yet Analyzed"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!selectedCell && (
                <div className="flex items-center gap-2 text-text-muted opacity-50 px-2 py-1">
                    <Info size={12} />
                    <span className="text-[9px] font-black uppercase tracking-tight">Tap any cell to inspect fluency metrics</span>
                </div>
            )}
        </div>
    );
};
