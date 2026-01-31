import React, { useState, useEffect, useMemo } from 'react';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { useAuth } from '@core/auth/AuthContext';
import { dbAdapter } from '@core/database/adapter';
import { clsx } from 'clsx';
import { Timer, Target, Zap, ChevronRight, TrendingUp } from 'lucide-react';

/**
 * TABLES MASTERY DASHBOARD
 * Analyzes logs to provide granular speed and accuracy metrics for each table.
 */

interface TableStats {
    id: number;
    testedCount: number;
    accuracy: number;
    avgSpeed: number;
    status: 'NOT_STARTED' | 'PRACTICING' | 'MASTERED';
    mastery: number;
}

export const TablesMasteryDashboard: React.FC = () => {
    const { user } = useAuth();
    const { mastery } = useIntelligence();
    const [stats, setStats] = useState<TableStats[]>([]);
    const [globalAvgSpeed, setGlobalAvgSpeed] = useState(0);

    useEffect(() => {
        const analyzeLogs = async () => {
            if (!user) return;
            const sessions = await dbAdapter.getSessionsForUser(user.uid);
            const allLogs = sessions.flatMap(s => s.logs || []);

            const tables = Array.from({ length: 11 }, (_, i) => i + 2); // 2x to 12x
            const analyzed: TableStats[] = tables.map(num => {
                const atomId = `table-${num}`;
                const tableLogs = allLogs.filter(l => l.atomId === atomId);
                const mVal = mastery[atomId] || 0;

                const correctLogs = tableLogs.filter(l => l.isCorrect);
                const accuracy = tableLogs.length > 0 ? (correctLogs.length / tableLogs.length) * 100 : 0;
                const avgSpeed = correctLogs.length > 0
                    ? correctLogs.reduce((acc, l) => acc + l.duration, 0) / correctLogs.length
                    : 0;

                let status: TableStats['status'] = 'NOT_STARTED';
                if (mVal > 0.85) status = 'MASTERED';
                else if (tableLogs.length > 0) status = 'PRACTICING';

                return {
                    id: num,
                    testedCount: tableLogs.length,
                    accuracy,
                    avgSpeed,
                    status,
                    mastery: mVal
                };
            });

            setStats(analyzed);

            const allCorrect = allLogs.filter(l => l.isCorrect);
            if (allCorrect.length > 0) {
                setGlobalAvgSpeed(allCorrect.reduce((acc, l) => acc + l.duration, 0) / allCorrect.length);
            }
        };

        analyzeLogs();
    }, [user, mastery]);

    const topStrength = useMemo(() => {
        return [...stats].sort((a, b) => b.accuracy - a.accuracy || a.avgSpeed - b.avgSpeed)[0];
    }, [stats]);

    const focusArea = useMemo(() => {
        return stats.find(s => s.status === 'PRACTICING') || stats.find(s => s.status === 'NOT_STARTED');
    }, [stats]);

    return (
        <div className="space-y-6">
            {/* 1. Quick Stats Row */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-app-surface border border-app-border rounded-2xl p-4">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Top Strength</p>
                    <p className="text-lg font-black text-emerald-500">{topStrength ? `${topStrength.id}x Table` : "---"}</p>
                </div>
                <div className="bg-app-surface border border-app-border rounded-2xl p-4">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Focus Area</p>
                    <p className="text-lg font-black text-app-primary">{focusArea ? `${focusArea.id}x Table` : "---"}</p>
                </div>
                <div className="bg-app-surface border border-app-border rounded-2xl p-4">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Global Speed</p>
                    <p className="text-lg font-black text-text-main">{globalAvgSpeed.toFixed(1)}s</p>
                </div>
            </div>

            {/* 2. Detailed Grid */}
            <div className="bg-app-surface border border-app-border rounded-[32px] overflow-hidden">
                <header className="p-6 border-b border-app-border bg-app-bg/50">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={16} className="text-app-primary" />
                        Fluency Breakdown
                    </h3>
                </header>

                <div className="divide-y divide-app-border">
                    {stats.map(s => (
                        <div key={s.id} className="p-4 flex items-center justify-between group hover:bg-app-bg/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm border",
                                    s.status === 'MASTERED' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                                        s.status === 'PRACTICING' ? "bg-app-primary/10 border-app-primary/20 text-app-primary" :
                                            "bg-app-bg border-app-border text-text-muted"
                                )}>
                                    {s.id}x
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-text-main uppercase">
                                            {s.status.replace('_', ' ')}
                                        </span>
                                        {s.status === 'MASTERED' && (
                                            <Zap size={10} className="text-amber-500 fill-amber-500" />
                                        )}
                                    </div>
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-tighter">
                                        {s.testedCount} Attempts • {Math.round(s.mastery * 100)}% Stability
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 text-emerald-600">
                                        <Target size={12} />
                                        <span className="text-sm font-black">{Math.round(s.accuracy)}%</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-1 text-text-muted">
                                        <Timer size={12} />
                                        <span className="text-[10px] font-bold">{s.avgSpeed.toFixed(1)}s</span>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
