import React from 'react';
import { useProgression } from '@core/engine/ProgressionContext';
import { getProgressToNextLevel } from '@core/engine/progression';

/**
 * HERO CARD
 * A high-impact visualization of the student's Hero Level and Power Points.
 * Designed for both Mobile Quest and Study Era dashboards.
 */

export const HeroCard: React.FC = () => {
    const { stats, isLoaded } = useProgression();

    if (!isLoaded) {
        return (
            <div className="bg-app-surface border border-app-border p-5 rounded-[32px] animate-pulse">
                <div className="h-12 w-12 bg-app-bg rounded-full mb-4" />
                <div className="h-4 w-24 bg-app-bg rounded mb-2" />
                <div className="h-2 w-full bg-app-bg rounded-full" />
            </div>
        );
    }

    const progress = getProgressToNextLevel(stats.powerPoints);

    return (
        <div className="bg-app-surface border border-app-border p-5 rounded-[32px] shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-4 relative z-10">
                {/* Level Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-app-primary to-app-secondary flex items-center justify-center text-white font-black text-2xl shadow-lg border-4 border-app-surface group-hover:scale-110 transition-transform">
                    {stats.heroLevel}
                </div>

                <div className="flex-1">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Hero Status</p>
                    <h4 className="text-lg font-black text-text-main leading-none">
                        {stats.heroLevel >= 10 ? 'Elite Shinobi' : 'Shinobi Candidate'}
                    </h4>
                </div>

                <div className="text-right">
                    <p className="text-[10px] font-black text-app-primary uppercase tracking-widest mb-0.5">Power Points</p>
                    <p className="text-xl font-black text-text-main tracking-tight">
                        {stats.powerPoints.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* XP Progress Section */}
            <div className="space-y-2 relative z-10">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-text-muted">
                    <span>Level Progress</span>
                    <span>{Math.round(progress)}% to Level {stats.heroLevel + 1}</span>
                </div>
                <div className="h-2.5 w-full bg-app-bg rounded-full overflow-hidden border border-app-border/50">
                    <div
                        className="h-full bg-gradient-to-r from-app-primary via-app-secondary to-app-accent transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Subtle Background Glow */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-app-primary/5 rounded-full blur-3xl group-hover:bg-app-primary/10 transition-colors" />
        </div>
    );
};
