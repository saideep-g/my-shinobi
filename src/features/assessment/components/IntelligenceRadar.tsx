import React, { useMemo } from 'react';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { SubjectBundle } from '@/types/bundles';
import { MasteryGauge } from './MasteryGauge';
import { ShieldCheck, Activity, Zap } from 'lucide-react';

/**
 * INTELLIGENCE RADAR HUB
 * The primary visualization for a subject's knowledge graph.
 * Maps individual atom masteries into a global progress overview.
 * 
 * Optimized with React.memo to prevent re-renders unless mastery values change.
 */

interface IntelligenceRadarProps {
    bundle: SubjectBundle;
}

export const IntelligenceRadar = React.memo(({ bundle }: IntelligenceRadarProps) => {
    const { mastery, getAtomMastery } = useIntelligence();

    // 1. Memoize high-level stats calculation
    const subjectStats = useMemo(() => {
        const allAtoms = bundle.curriculum.chapters.flatMap(c => c.atoms);
        const masteredCount = allAtoms.filter(a => (mastery[a.id] || 0) >= 0.85).length;
        const totalAtoms = bundle.stats?.totalAtoms || allAtoms.length || 1;

        const sumMastery = allAtoms.reduce((acc, a) => acc + (mastery[a.id] || 0), 0);
        const averageSignal = Math.round((sumMastery / totalAtoms) * 100);

        return { masteredCount, averageSignal, allAtoms };
    }, [bundle, mastery]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Subject Header Stats */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard
                    icon={<ShieldCheck className="text-app-accent" />}
                    label="Mastered Atoms"
                    value={subjectStats.masteredCount}
                />
                <StatCard
                    icon={<Activity className="text-app-primary" />}
                    label="Average Signal"
                    value={`${subjectStats.averageSignal}%`}
                />
            </div>

            {/* Chapter-wise Breakdown */}
            {bundle.curriculum.chapters.map((chapter) => (
                <div
                    key={chapter.id}
                    className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm overflow-hidden relative group"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-app-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                            <Zap size={18} className="text-app-primary" />
                        </div>
                        <h3 className="text-lg font-black tracking-tight text-text-main">{chapter.title}</h3>
                    </div>

                    <div className="space-y-6">
                        {chapter.atoms.map((atom) => (
                            <MasteryGauge
                                key={atom.id}
                                label={atom.title}
                                probability={getAtomMastery(atom.id)}
                            />
                        ))}
                    </div>

                    {/* Faint background decoration to fit "Radar" theme */}
                    <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]">
                        <div className="w-40 h-40 border-[10px] border-app-primary rounded-full" />
                        <div className="w-60 h-60 border-[10px] border-app-primary rounded-full -mt-20 -ml-10" />
                    </div>
                </div>
            ))}
        </div>
    );
});

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
    <div className="bg-app-surface border border-app-border p-4 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all">
        <div className="p-3 bg-app-bg rounded-xl shadow-inner">{icon}</div>
        <div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</p>
            <p className="text-xl font-black text-text-main">{value}</p>
        </div>
    </div>
);
