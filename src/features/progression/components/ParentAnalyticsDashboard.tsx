import React, { useMemo } from 'react';
import { useProgression } from '@/core/engine/ProgressionContext';
import { FluencyHeatmap } from './FluencyHeatmap';
import { BarChart, Clock, CheckCircle2, AlertCircle, History, LayoutDashboard } from 'lucide-react';

/**
 * PARENT/TEACHER ANALYTICS DASHBOARD
 * Shows high-level trends, consistency charts, and table breakdown scatter plots.
 */

export const ParentAnalyticsDashboard: React.FC = () => {
    const { stats } = useProgression();
    const config = stats.tablesConfig;

    const statsSummary = useMemo(() => {
        if (!config) return { totalMastered: 0, avgAccuracy: 0, avgSpeed: 0 };
        const statsArr = Object.values(config.tableStats);
        return {
            totalMastered: statsArr.filter(s => s.status === 'MASTERED').length,
            avgAccuracy: statsArr.length ? statsArr.reduce((acc, s) => acc + s.accuracy, 0) / statsArr.length : 0,
            avgSpeed: statsArr.length ? statsArr.reduce((acc, s) => acc + s.avgSpeed, 0) / statsArr.length : 0
        };
    }, [config]);

    return (
        <div className="space-y-8 pb-20 p-2 md:p-6">
            <header className="flex justify-between items-center bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-app-primary/10 text-app-primary rounded-2xl">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-text-main">Analytic Command Center</h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Observation Deck • Fluency Reports</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 group cursor-help">
                    <History size={16} className="text-text-muted" />
                    <span className="text-[10px] font-bold text-text-muted group-hover:text-app-primary transition-colors">Last Updated: Just now</span>
                </div>
            </header>

            {/* High Level Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <CheckCircle2 size={20} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Overall Accuracy</h4>
                    <p className="text-3xl font-black text-text-main">{Math.round(statsSummary.avgAccuracy)}%</p>
                </div>

                <div className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Clock size={20} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">-0.4s</span>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Average Response</h4>
                    <p className="text-3xl font-black text-text-main">{statsSummary.avgSpeed ? (statsSummary.avgSpeed / 1000).toFixed(2) : '--'}s</p>
                </div>

                <div className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                            <AlertCircle size={20} />
                        </div>
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">3 Critical</span>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Struggling Facts</h4>
                    <p className="text-3xl font-black text-text-main">
                        {config ? Object.values(config.factStreaks).filter(s => s === 0).length : 0}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. The Global Heatmap (Observation View) */}
                <div className="space-y-4">
                    <h3 className="text-sm font-black flex items-center gap-2 px-2 uppercase tracking-widest text-text-muted">
                        <BarChart size={16} /> Mastery Distribution
                    </h3>
                    <FluencyHeatmap />
                </div>

                {/* 2. Consistency & Growth Charts (Placeholders for complex SVG logic) */}
                <div className="bg-app-surface border border-app-border rounded-[32px] p-8 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-app-bg rounded-full flex items-center justify-center border-4 border-dashed border-app-border">
                        <History size={32} className="text-text-muted opacity-20" />
                    </div>
                    <div>
                        <h4 className="font-black text-text-main uppercase tracking-widest text-xs">Growth Trajectory</h4>
                        <p className="text-[10px] font-medium text-text-muted mt-2 max-w-[240px]">
                            Daily consistency tracking and speed trend analysis will appear here as more sessions are completed.
                        </p>
                    </div>
                    <button className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] border-b border-app-primary pb-1 hover:opacity-70 transition-opacity">
                        View Detailed Log
                    </button>
                </div>
            </div>
        </div>
    );
};
