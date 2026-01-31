import React from 'react';
import { WeeklyStats } from '../hooks/useWeeklyStats';
import { Trophy, Flame, Target, Zap } from 'lucide-react';

/**
 * PARENTAL REPORT CARD
 * A visually optimized component designed for image capture and sharing.
 * Celebrates student achievements with high-contrast visuals and premium layout.
 */

interface Props {
    stats: WeeklyStats;
    studentName?: string;
}

// Constant ID used by the ShareService to locate the DOM node
export const REPORT_CARD_ID = "shinobi-weekly-report-card";

export const ParentalReportCard: React.FC<Props> = ({ stats, studentName = "Young Shinobi" }) => {
    return (
        <div
            id={REPORT_CARD_ID}
            className="bg-app-surface p-10 rounded-[48px] border-[6px] border-app-primary/10 shadow-3xl relative overflow-hidden flex flex-col items-center"
            style={{ width: '450px', minHeight: '600px' }} // Fixed dimensions for consistent sharing
        >
            {/* Dynamic Background Element */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 text-app-primary/5 rotate-12">
                <Zap size={220} />
            </div>

            {/* Header Section */}
            <header className="text-center mb-10 relative z-10">
                <div className="inline-flex p-6 bg-app-primary text-white rounded-[32px] mb-6 shadow-2xl shadow-app-primary/30 animate-bounce">
                    <Trophy size={48} />
                </div>
                <h1 className="text-3xl font-black tracking-tighter text-text-main uppercase leading-tight">
                    Weekly Mastery<br />Report
                </h1>
                <div className="mt-4 px-6 py-1.5 bg-app-bg border border-app-border rounded-full inline-block">
                    <p className="text-[11px] font-black text-app-primary tracking-[0.2em]">{stats.weekLabel}</p>
                </div>
            </header>

            {/* Body Section */}
            <div className="w-full space-y-8 relative z-10 flex-1">
                <div className="text-center">
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em] mb-1">Student Elite</p>
                    <h2 className="text-2xl font-black text-text-main">{studentName}</h2>
                    <div className="inline-block bg-app-accent/10 text-app-accent text-[11px] font-black px-4 py-1.5 rounded-2xl mt-3 border border-app-accent/20">
                        RANK: HERO LEVEL {stats.currentLevel}
                    </div>
                </div>

                {/* Highlighted Stats Grid */}
                <div className="grid grid-cols-2 gap-5">
                    <StatBox
                        icon={<Target className="text-app-primary" size={24} />}
                        label="Questions Conquered"
                        value={stats.questionsAnswered}
                    />
                    <StatBox
                        icon={<Flame className="text-orange-500" size={24} />}
                        label="Active Streak"
                        value={`${stats.currentStreak} Days`}
                    />
                </div>

                {/* Mastery Reflection */}
                <div className="bg-app-bg border-2 border-dashed border-app-border rounded-[32px] p-6 text-center italic">
                    <p className="text-text-main font-bold text-sm leading-relaxed">
                        "Precision is the hallmark of a true master. Your dedication to English excellence is inspiring!"
                    </p>
                </div>
            </div>

            {/* Branding Footer */}
            <footer className="text-center mt-10 pt-6 border-t border-app-border w-full">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">
                    Verified by My-Shinobi Engine
                </p>
            </footer>
        </div>
    );
};

/**
 * Internal Stat Display Box
 */
const StatBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="bg-app-bg border border-app-border p-6 rounded-[32px] text-center shadow-inner">
        <div className="mb-3 flex justify-center opacity-80">{icon}</div>
        <p className="text-3xl font-black text-text-main leading-none mb-2">{value}</p>
        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-tight">{label}</p>
    </div>
);
