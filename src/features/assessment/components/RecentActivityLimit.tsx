import React, { useEffect, useState } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { useAuth } from '@core/auth/AuthContext';
import { AssessmentSession } from '@/types/assessment';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * RECENT ACTIVITY LIMIT
 * Shows the last N sessions on the home page.
 */
export const RecentActivityLimit: React.FC<{ count: number }> = ({ count }) => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<AssessmentSession[]>([]);

    useEffect(() => {
        const loadHistory = async () => {
            if (!user) return;
            const data = await dbAdapter.getSessionsForUser(user.uid);
            setSessions([...data].sort((a, b) => b.startTime - a.startTime).slice(0, count));
        };
        loadHistory();
    }, [user, count]);

    if (sessions.length === 0) return null;

    return (
        <div className="space-y-3">
            {sessions.map((session) => {
                const total = session.logs.length;
                const correct = session.logs.filter(l => l.isCorrect).length;
                const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

                return (
                    <div key={session.id} className="bg-app-surface border border-app-border p-4 rounded-3xl flex items-center justify-between group hover:border-app-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-app-bg rounded-xl flex items-center justify-center text-app-primary group-hover:scale-110 transition-transform">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">
                                    {new Date(session.startTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-sm font-black text-text-main uppercase tracking-tight">
                                    {session.type.replace('_', ' ')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 font-mono">
                            <div className="text-right">
                                <p className="text-sm font-black text-app-accent">{accuracy}%</p>
                                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{correct}/{total} Hits</p>
                            </div>
                        </div>
                    </div>
                );
            })}
            <Link
                to="/history"
                className="flex items-center justify-between p-4 bg-app-bg border border-app-border border-dashed rounded-3xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-main hover:border-app-primary/50 transition-all group"
            >
                View Full Archive
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    );
};
