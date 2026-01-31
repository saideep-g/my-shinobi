import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBundleById } from '@features/curriculum/data/bundleRegistry';
import { TablesMasteryDashboard } from './TablesMasteryDashboard';
import { FluencyHeatmap } from './FluencyHeatmap';
import { ChevronLeft, Sword } from 'lucide-react';

/**
 * TABLE DASHBOARD
 * A specialized hub for Multiplication Tables.
 * Combines granular mastery stats with a 12x12 fluency grid.
 */

export const TableDashboard: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();

    const bundle = subjectId ? getBundleById(subjectId) : null;

    if (!bundle) {
        return <div className="p-10 text-center">Subject not found.</div>;
    }

    return (
        <div className="space-y-8 p-6 pb-24 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex items-center gap-4 max-w-xl mx-auto">
                <button
                    onClick={() => navigate('/quest')}
                    className="p-3 bg-app-surface border border-app-border rounded-2xl hover:bg-app-bg transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h3 className="text-xl font-black text-text-main">{bundle.curriculum.name}</h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Dynamic Training Unit</p>
                </div>
            </header>

            <div className="max-w-xl mx-auto space-y-8">
                {/* 1. Call to Action */}
                <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="text-2xl font-black mb-2">Ready to Forge?</h4>
                        <p className="text-white/80 text-sm mb-8 max-w-[200px]">The engine will pick your weakest tables for practice.</p>

                        <button
                            onClick={() => navigate(`/quest/${bundle.id}/play`)}
                            className="flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                            <Sword size={20} />
                            Start Quest
                        </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 right-8 text-white/5 font-black text-9xl select-none translate-y-1/4">
                        ×
                    </div>
                </div>

                {/* 2. Fluency Heatmap (The 12x12 Grid) */}
                <FluencyHeatmap />

                {/* 3. Detailed Mastery Table */}
                <TablesMasteryDashboard />

                {/* 4. Help Text */}
                <div className="p-6 bg-app-surface border border-app-border rounded-3xl">
                    <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">How it works</h5>
                    <p className="text-xs text-text-muted leading-relaxed">
                        Mastery is calculated for each specific fact. The engine uses a <strong>70% Current / 30% Review</strong> rule
                        to ensure you never forget old tables while mastering new ones.
                    </p>
                </div>
            </div>
        </div>
    );
};
