import React from 'react';
import { useMission } from '../context/MissionContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { Flame, Target, Trophy } from 'lucide-react';

/**
 * DAILY MISSION CARD
 * High-impact UI component that sits at the top of the student dashboard.
 * Visualizes the "Habit Loop" through streaks and progress toward the daily goal.
 */

export const DailyMissionCard: React.FC = () => {
    const { progress } = useMission();
    const { stats } = useProgression();

    return (
        <div className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm overflow-hidden relative group">

            {/* Header with Streak and Reward indicator */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                        <Flame
                            size={32}
                            fill={stats.streakCount > 0 ? "currentColor" : "none"}
                            className={stats.streakCount > 0 ? "animate-pulse" : "opacity-30"}
                        />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Current Streak</p>
                        <p className="text-2xl font-black text-text-main leading-tight">{stats.streakCount} Days</p>
                    </div>
                </div>

                {progress.isComplete && (
                    <div className="bg-app-accent text-white p-3 rounded-full shadow-lg shadow-app-accent/20 animate-bounce">
                        <Trophy size={20} />
                    </div>
                )}
            </div>

            {/* Progress Section */}
            <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-text-main flex items-center gap-2">
                        <div className="p-1 bg-app-primary/10 rounded-md">
                            <Target size={14} className="text-app-primary" />
                        </div>
                        Daily Quest
                    </span>
                    <span className="text-text-muted font-mono">{progress.count} / {progress.goal} Questions</span>
                </div>

                {/* Themed Progress Bar */}
                <div className="h-5 w-full bg-app-bg rounded-full p-1 border border-app-border overflow-hidden shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-app-primary rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2"
                        style={{ width: `${progress.percent}%` }}
                    >
                        {progress.percent > 15 && (
                            <div className="w-1 h-1 bg-white/40 rounded-full animate-ping" />
                        )}
                    </div>
                </div>

                <p className="text-[9px] font-black uppercase tracking-widest text-text-muted text-right">
                    {progress.isComplete ? "Goal Reached! +50 XP Bonus" : "Complete to earn daily bonus"}
                </p>
            </div>

            {/* Decorative Background Icon */}
            <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Flame size={140} />
            </div>
        </div>
    );
};
