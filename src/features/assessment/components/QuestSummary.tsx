import React, { useMemo, useEffect, useState } from 'react';
import { useSession } from '@core/engine/SessionContext';
import { MasteryGauge } from './MasteryGauge';
import { Trophy, Zap, Clock, Star, ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { dbAdapter } from '@core/database/adapter';
import { AssessmentSession } from '@/types/assessment';

/**
 * QUEST SUMMARY SCREEN
 * A high-impact, celebratory transition after completing a learning session.
 * Visualizes XP Gained, Accuracy, and Mastery Growth.
 */

export const QuestSummary: React.FC<{ onAction?: () => void }> = ({ onAction }) => {
    const { activeBundle, isSessionComplete, activeSessionId } = useSession();
    const { width, height } = useWindowSize();
    const [sessionData, setSessionData] = useState<AssessmentSession | null>(null);

    // 1. Fetch the completed session data from IndexedDB
    useEffect(() => {
        const fetchSession = async () => {
            if (isSessionComplete && activeSessionId) {
                const data = await dbAdapter.get<AssessmentSession>('sessions', activeSessionId);
                if (data) setSessionData(data);
            }
        };
        fetchSession();
    }, [isSessionComplete, activeSessionId]);

    // 2. Aggregate Stats for display
    const summaryStats = useMemo(() => {
        if (!sessionData) return { xpEarned: 0, accuracy: 0, topAtom: '...' };

        const total = sessionData.logs.length;
        const correct = sessionData.logs.filter(l => l.isCorrect).length;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

        // Find the most frequent atom in this session
        const atomCounts: Record<string, number> = {};
        sessionData.logs.forEach(l => {
            atomCounts[l.atomId] = (atomCounts[l.atomId] || 0) + 1;
        });
        const topAtomId = Object.keys(atomCounts).reduce((a, b) => atomCounts[a] > atomCounts[b] ? a : b, 'Curriculum');

        return {
            xpEarned: sessionData.pointsGained,
            accuracy,
            topAtom: topAtomId
        };
    }, [sessionData]);

    if (!isSessionComplete) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-app-bg overflow-y-auto animate-in fade-in duration-700">
            {/* Celebration Layer */}
            <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={400}
                gravity={0.15}
                colors={['#7C3AED', '#10B981', '#F59E0B', '#3B82F6']}
            />

            <div className="relative max-w-md mx-auto min-h-screen flex flex-col p-8 pb-16">

                {/* Hero Section */}
                <header className="py-12 text-center space-y-4 animate-in zoom-in-90 duration-500">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-app-accent/20 blur-3xl rounded-full" />
                        <div className="relative w-24 h-24 bg-app-accent/10 rounded-[32px] flex items-center justify-center text-app-accent mb-6 animate-bounce">
                            <Trophy size={56} fill="currentColor" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-text-main leading-tight">
                        QUEST<br />CLEARED!
                    </h1>
                    <p className="text-text-muted font-bold uppercase tracking-[0.3em] text-[10px] bg-app-surface px-4 py-1.5 rounded-full border border-app-border inline-block">
                        {activeBundle?.curriculum.name || 'Practice Session'}
                    </p>
                </header>

                {/* Reward Grid (XP & Performance) */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-app-surface border border-app-border p-6 rounded-[32px] text-center shadow-sm group hover:border-app-primary/50 transition-colors">
                        <Zap className="mx-auto text-app-primary mb-3 group-hover:scale-125 transition-transform" size={28} fill="currentColor" />
                        <p className="text-3xl font-black text-text-main">+{summaryStats.xpEarned}</p>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Power Points</p>
                    </div>

                    <div className="bg-app-surface border border-app-border p-6 rounded-[32px] text-center shadow-sm group hover:border-app-accent/50 transition-colors">
                        <Star className="mx-auto text-app-accent mb-3 group-hover:scale-125 transition-transform" size={28} fill="currentColor" />
                        <p className="text-3xl font-black text-text-main">{summaryStats.accuracy}%</p>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Precision</p>
                    </div>
                </div>

                {/* Intelligence Signal Update */}
                <div className="bg-app-surface border border-app-border rounded-[40px] p-8 mb-10 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-app-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                    <h3 className="text-[10px] font-black mb-8 uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                        <Clock size={16} /> Mastery Development
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="animate-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                            <MasteryGauge label={summaryStats.topAtom} probability={0.88} />
                            <div className="flex items-center gap-2 mt-3 text-app-accent">
                                <div className="w-1.5 h-1.5 rounded-full bg-app-accent animate-ping" />
                                <p className="text-[11px] font-black uppercase tracking-wider">Significant Signal Growth</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onAction ? onAction() : window.location.reload()}
                    className="mt-auto w-full py-6 bg-app-primary text-white rounded-[28px] font-black text-xl shadow-2xl shadow-app-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                    RETURN TO WAYPOINT
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    );
};
