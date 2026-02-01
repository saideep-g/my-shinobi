import React from 'react';
import { useProgression } from '@/core/engine/ProgressionContext';
import { FluencyHeatmap } from './FluencyHeatmap';
import { Star, Trophy, ArrowRight, Zap, Target } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

/**
 * TABLES MASTERY DASHBOARD
 * The central hub for multiplication table focus.
 * Shows current stage, table progress cards, and the global heatmap.
 */

export const TablesMasteryDashboard: React.FC = () => {
    const { stats } = useProgression();
    const config = stats.tablesConfig || {
        currentPathStage: 2,
        tableStats: {},
        factStreaks: {},
        personalBests: {}
    };

    const currentStage = config.currentPathStage;

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Hero Summary */}
            <header className="relative bg-app-surface border border-app-border rounded-[48px] p-8 md:p-12 shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Zap size={200} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <Trophy size={20} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Path to Mastery</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-text-main leading-tight">
                            You are Mastering <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                                The {currentStage}s Table
                            </span>
                        </h1>
                        <p className="max-w-md text-sm font-medium text-text-muted leading-relaxed">
                            Defeat the Ghost in the {currentStage}s grid to unlock advanced multipliers and climb the global leaderboards.
                        </p>
                    </div>

                    <Link
                        to="/tables/practice"
                        className="flex items-center justify-center gap-4 bg-app-primary text-white px-10 py-6 rounded-[28px] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-app-primary/30 group/btn"
                    >
                        Enter Training Grid
                        <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 2. Fluency Heatmap (Focus Area) */}
                <div className="lg:col-span-2">
                    <FluencyHeatmap />
                </div>

                {/* 3. Table Breakdown Roster */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black flex items-center gap-2 px-2">
                        <Target size={16} className="text-rose-500" /> Progression Roster
                    </h3>
                    <div className="space-y-3">
                        {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => {
                            const table = config.tableStats[num];
                            const isLocked = num > currentStage;
                            const isCurrent = num === currentStage;

                            return (
                                <div
                                    key={num}
                                    className={clsx(
                                        "p-4 rounded-[24px] border transition-all flex items-center justify-between",
                                        isLocked ? "bg-app-bg opacity-40 border-app-border" : "bg-app-surface border-app-border shadow-sm",
                                        isCurrent && "border-indigo-500 ring-2 ring-indigo-500/10 shadow-indigo-500/5 outline-2 outline-indigo-500/30"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                                            isLocked ? "bg-app-bg text-text-muted" : "bg-indigo-50 text-indigo-500"
                                        )}>
                                            {num}s
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">
                                                {table?.status || (isLocked ? 'LOCKED' : 'READY')}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Star size={10} className="text-amber-500" fill="currentColor" />
                                                    <span className="text-xs font-black">{Math.round(table?.accuracy || 0)}%</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Zap size={10} className="text-indigo-500" fill="currentColor" />
                                                    <span className="text-xs font-black">{table?.avgSpeed ? (table.avgSpeed / 1000).toFixed(1) + 's' : '--'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {!isLocked && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
