import React, { useEffect, useState } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { useAuth } from '@core/auth/AuthContext';
import { AssessmentSession } from '@/types/assessment';
import { Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

/**
 * HISTORY VAULT
 * Allows students to review previous sessions and their results.
 * Fetches from IndexedDB for instant offline access.
 */

export const HistoryVault: React.FC = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<AssessmentSession[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            if (!user) return;
            const data = await dbAdapter.getSessionsForUser(user.uid);
            // Sort by most recent
            setSessions([...data].sort((a, b) => b.startTime - a.startTime));
        };
        loadHistory();
    }, [user]);

    return (
        <div className="p-6 space-y-4 max-w-md mx-auto pb-24">
            <header className="px-2 mb-6">
                <h2 className="text-2xl font-black text-text-main tracking-tight">Past Adventures</h2>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Quest History & Review</p>
            </header>

            <div className="space-y-4">
                {sessions.map((session) => (
                    <button
                        key={session.id}
                        className="w-full bg-app-surface border border-app-border p-5 rounded-[2.5rem] flex items-center justify-between hover:border-app-primary/50 transition-all text-left shadow-sm group active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-app-bg border border-app-border rounded-2xl flex items-center justify-center text-app-primary group-hover:scale-110 transition-transform">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <p className="font-black text-lg text-text-main leading-none mb-1">
                                    {new Date(session.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </p>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-muted">
                                    <span className="flex items-center gap-1.5 text-app-accent">
                                        <CheckCircle size={12} fill="currentColor" fillOpacity={0.1} /> {session.logs.filter(l => l.isCorrect).length} Correct
                                    </span>
                                    <span className="flex items-center gap-1.5 text-rose-500">
                                        <XCircle size={12} fill="currentColor" fillOpacity={0.1} /> {session.logs.filter(l => !l.isCorrect).length} Missed
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                    </button>
                ))}

                {sessions.length === 0 && (
                    <div className="text-center py-20 px-6 bg-app-surface border border-app-border border-dashed rounded-[3rem]">
                        <div className="w-16 h-16 bg-app-bg rounded-3xl flex items-center justify-center text-text-muted mx-auto mb-4">
                            <Calendar size={32} />
                        </div>
                        <p className="font-black text-text-main text-lg">No history yet.</p>
                        <p className="text-xs font-medium text-text-muted mt-2">Complete your first quest to unlock the archive!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
