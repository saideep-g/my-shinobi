import React, { useMemo, useState } from 'react';
import { SubjectBundle } from '@/types/bundles';
import { curriculumIntelligence } from '../services/curriculumIntelligence';
import { ShieldCheck, Filter, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
    bundle: SubjectBundle;
}

/**
 * COVERAGE RADAR
 * A high-resolution heatmap for curriculum health.
 */
export const CoverageRadar: React.FC<Props> = ({ bundle }) => {
    const [showGapsOnly, setShowGapsOnly] = useState(false);

    // X-Axis Templates (Instructions say: MCQ, Numeric, Sorting, Matching, Two-Tier)
    const columns = [
        { id: 'mcq', label: 'MCQ' },
        { id: 'numeric', label: 'Numeric' },
        { id: 'sorting', label: 'Sorting' },
        { id: 'matching', label: 'Matching' },
        { id: 'two-tier', label: 'Two-Tier' }
    ];

    // Summary Analytics
    const summary = useMemo(() => curriculumIntelligence.getBundleSummary(bundle), [bundle]);

    // Chapter Analysis
    const chapterData = useMemo(() => {
        return bundle.curriculum.chapters.map(ch => ({
            ...ch,
            health: curriculumIntelligence.calculateChapterHealth(bundle, ch.id)
        }));
    }, [bundle]);

    // Filtering
    const displayedChapters = showGapsOnly
        ? chapterData.filter(ch => ch.health.coverageStatus !== 'HEALTHY')
        : chapterData;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* 1. TOP ANALYTICS STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-app-surface border border-app-border p-6 rounded-[32px] shadow-sm">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Subject Health</p>
                    <p className={clsx(
                        "text-3xl font-black",
                        summary.healthPercentage > 80 ? "text-emerald-500" : summary.healthPercentage > 50 ? "text-amber-500" : "text-rose-500"
                    )}>{summary.healthPercentage}%</p>
                </div>

                <div className="bg-app-surface border border-app-border p-6 rounded-[32px] shadow-sm">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Total Gaps</p>
                    <p className={clsx(
                        "text-3xl font-black",
                        summary.totalGaps > 0 ? "text-rose-500" : "text-emerald-500"
                    )}>{summary.totalGaps}</p>
                </div>

                <div className="bg-app-surface border border-app-border p-6 rounded-[32px] shadow-sm">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Live Atoms</p>
                    <p className="text-3xl font-black text-indigo-600">{summary.totalAtoms}</p>
                </div>

                <div className="bg-app-surface border border-app-border p-6 rounded-[32px] shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Diversity Filter</p>
                        <p className="text-xs font-bold text-text-main">{showGapsOnly ? 'Focus on Gaps' : 'All Chapters'}</p>
                    </div>
                    <button
                        onClick={() => setShowGapsOnly(!showGapsOnly)}
                        className={clsx(
                            "p-3 rounded-2xl border transition-all",
                            showGapsOnly ? "bg-amber-500 border-amber-600 text-white" : "bg-app-bg border-app-border text-text-muted hover:text-text-main"
                        )}
                    >
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* 2. HEATMAP GRID */}
            <div className="bg-app-surface border border-app-border rounded-[48px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-app-bg/50 border-b border-app-border">
                                <th className="p-8 font-black text-[10px] uppercase tracking-widest text-text-muted">Chapter Architecture</th>
                                {columns.map(col => (
                                    <th key={col.id} className="p-8 text-center font-black text-[10px] uppercase tracking-widest text-text-muted border-l border-app-border/10">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-app-border/10">
                            {displayedChapters.map(chapter => (
                                <tr key={chapter.id} className="group hover:bg-app-bg/30 transition-colors">
                                    <td className="p-8">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-black text-text-main group-hover:text-app-primary transition-colors">{chapter.title}</h4>
                                            {chapter.health.coverageStatus === 'CRITICAL' && <AlertTriangle size={14} className="text-rose-500" />}
                                            {chapter.health.diversityStatus === 'ROBUST' && <ShieldCheck size={14} className="text-emerald-500" />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{chapter.health.totalQuestions} Questions Total</span>
                                            {chapter.health.diversityStatus === 'WEAK' && (
                                                <span className="text-[8px] font-black bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded uppercase tracking-tighter">Low Diversity</span>
                                            )}
                                        </div>
                                    </td>
                                    {columns.map(col => {
                                        const count = chapter.health.templateBreakdown[col.id] || 0;
                                        return (
                                            <td key={col.id} className="p-2 border-l border-app-border/10">
                                                <div
                                                    title={count === 0 && chapter.health.emptyAtoms.length > 0 ? `Gaps in: ${chapter.health.emptyAtoms.join(', ')}` : ''}
                                                    className={clsx(
                                                        "h-16 w-full rounded-2xl flex flex-col items-center justify-center transition-all relative group/cell",
                                                        count === 0 ? "bg-rose-500/10 text-rose-600 border border-rose-200" :
                                                            count < 3 ? "bg-amber-500/5 text-amber-600 border border-amber-200/50" :
                                                                "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
                                                    )}
                                                >
                                                    <span className="text-xl font-black leading-none">{count}</span>
                                                    {count === 0 && (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 bg-rose-500 rounded-2xl transition-all cursor-help">
                                                            <div className="text-white text-[8px] font-black uppercase tracking-tighter text-center p-2">
                                                                {chapter.health.emptyAtoms.length} Gaps Found
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {displayedChapters.length === 0 && (
                <div className="p-32 text-center bg-app-surface border border-app-border rounded-[48px] border-dashed">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={32} />
                    </div>
                    <h5 className="text-lg font-black tracking-tight">All Chapters Robust</h5>
                    <p className="text-sm text-text-muted mt-2">No gaps found with current filters. Switch off 'Gaps Only' to see the full matrix.</p>
                </div>
            )}
        </div>
    );
};
