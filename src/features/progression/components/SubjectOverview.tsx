import React from 'react';
import { SubjectBundle } from '@/types/bundles';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { Target, Award, BrainCircuit } from 'lucide-react';

/**
 * SUBJECT OVERVIEW
 * Provides a high-level summary of student progress within a specific subject.
 * Visualizes curriculum completion and Bayesian mastery signal strength.
 */

interface SubjectOverviewProps {
    bundle: SubjectBundle;
}

export const SubjectOverview: React.FC<SubjectOverviewProps> = ({ bundle }) => {
    const { mastery } = useIntelligence();

    // 1. Calculate Aggregated Data
    const atoms = bundle.curriculum.chapters.flatMap(c => c.atoms);
    const masteredCount = atoms.filter(a => (mastery[a.id] || 0) >= 0.85).length;

    // Calculate average mastery (knowledge signal) across the entire syllabus
    const sumMastery = atoms.reduce((acc, a) => acc + (mastery[a.id] || 0), 0);
    const avgMastery = atoms.length > 0 ? sumMastery / atoms.length : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in slide-in-from-top-4 duration-500">

            {/* Syllabus Completion Card */}
            <OverviewCard
                icon={<Target className="text-app-primary" size={28} />}
                label="Syllabus Progress"
                value={`${Math.round((masteredCount / atoms.length) * 100)}%`}
                subtext={`${masteredCount} of ${atoms.length} Concepts Mastered`}
                progress={masteredCount / atoms.length}
                color="bg-app-primary"
            />

            {/* Bayesian Intelligence Signal Card */}
            <OverviewCard
                icon={<BrainCircuit className="text-app-accent" size={28} />}
                label="Knowledge Signal"
                value={`${Math.round(avgMastery * 100)}%`}
                subtext="Average Stability Probability"
                progress={avgMastery}
                color="bg-app-accent"
            />

            {/* Global Rank Card */}
            <OverviewCard
                icon={<Award className="text-amber-500" size={28} />}
                label="Student Status"
                value={masteredCount === atoms.length ? "Master" : masteredCount > (atoms.length / 2) ? "Expert" : "Initiate"}
                subtext={`Ranked for ${bundle.curriculum.name}`}
                progress={masteredCount / atoms.length}
                color="bg-amber-500"
            />
        </div>
    );
};

/**
 * Reusable Overview Card Component
 */
const OverviewCard = ({ icon, label, value, subtext, progress, color }: any) => (
    <div className="bg-app-surface border border-app-border p-7 rounded-[40px] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
        {/* Micro-Progress Bar Overlay */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-app-bg">
            <div
                className={`h-full ${color} transition-all duration-1000 ease-out`}
                style={{ width: `${progress * 100}%` }}
            />
        </div>

        <div className="w-14 h-14 bg-app-bg rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
            {icon}
        </div>

        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-4xl font-black text-text-main my-1 tracking-tighter">{value}</p>
        <p className="text-xs text-text-muted font-bold tracking-tight mt-3">{subtext}</p>

        {/* Decorative blur */}
        <div className={`absolute -right-4 -bottom-4 w-12 h-12 ${color} opacity-[0.03] blur-2xl rounded-full group-hover:opacity-10 transition-opacity`} />
    </div>
);
