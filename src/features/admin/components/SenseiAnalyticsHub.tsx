import React, { useState, useEffect, useMemo } from 'react';
import { syncService } from '@services/sync/syncService';
import { processStudentSession } from '../services/analyticsEngine';
import { StrategicLogExplorer } from './StrategicLogExplorer';
import { MisconceptionRadar } from './MisconceptionRadar';
import { BehavioralHeatmap } from './BehavioralHeatmap';
import { StudentRoster } from './StudentRoster';
import { Zap, Activity, Filter, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * SENSEI ANALYTICS HUB
 * The primary command center for student performance analysis.
 * Aggregates logs, calculates strategic metrics, and identifies conceptual gaps.
 */
export const SenseiAnalyticsHub: React.FC = () => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [rawLogs, setRawLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const analytics = useMemo(() => {
        // Flat map all question logs from sessions
        const allQuestionLogs = rawLogs.flatMap(session => session.logs || []);
        return processStudentSession(allQuestionLogs);
    }, [rawLogs]);

    const loadStudentLogs = async (userId: string) => {
        setIsLoading(true);
        try {
            const sessions = await syncService.fetchAllSessions(userId);
            setRawLogs(sessions);
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedUserId) {
            loadStudentLogs(selectedUserId);
        }
    }, [selectedUserId]);

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700 pb-20">
            {/* Header: Global Dashboard Controls */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-text-main tracking-tighter flex items-center gap-4">
                        <Activity className="text-app-primary" size={40} /> Sensei Analytics
                    </h2>
                    <p className="text-sm font-medium text-text-muted mt-2">Deep-signal Bayesian pattern analysis & strategy review</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => selectedUserId && loadStudentLogs(selectedUserId)}
                        className="flex items-center gap-2 px-6 py-3 bg-app-surface border border-app-border rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-app-bg transition-all"
                    >
                        <RefreshCcw size={14} className={clsx(isLoading && "animate-spin")} />
                        {isLoading ? "Analyzing..." : "Refresh Signals"}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 border-2 border-app-primary bg-app-primary/10 text-app-primary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-app-primary/10 hover:scale-105 transition-all">
                        <Filter size={14} /> Intelligence Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                {/* Left Column: Roster & Behavioral Heatmap (4 cols) */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="h-[500px]">
                        <StudentRoster
                            selectedUserId={selectedUserId}
                            onSelectStudent={setSelectedUserId}
                        />
                    </div>
                    <div className="h-[400px]">
                        <BehavioralHeatmap logs={rawLogs.flatMap(s => s.logs || [])} />
                    </div>
                </div>

                {/* Right Column: Key Metrics, Misconceptions, and Logs (8 cols) */}
                <div className="xl:col-span-8 space-y-8">

                    {/* Top Stats: Strategy Mix & Efficiency */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-app-surface border border-app-border p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
                            <Zap className="absolute -right-4 -bottom-4 text-app-primary/10 rotate-12 group-hover:scale-110 transition-transform duration-700" size={120} />
                            <p className="text-[10px] font-black text-app-primary uppercase tracking-widest mb-2">Strategy Balance</p>
                            <h5 className="text-3xl font-black text-text-main">
                                {analytics.strategyMix.mastery.toFixed(0)}<span className="text-lg opacity-30">%</span>
                            </h5>
                            <p className="text-[10px] font-bold text-text-muted mt-1 italic">Focusing on Mastery Mode</p>
                            <div className="mt-6 flex gap-1 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: `${analytics.strategyMix.mastery}%` }} />
                                <div className="h-full bg-emerald-500" style={{ width: `${analytics.strategyMix.remedial}%` }} />
                                <div className="h-full bg-amber-500" style={{ width: `${analytics.strategyMix.diagnostic}%` }} />
                            </div>
                        </div>

                        <div className="bg-app-surface border border-app-border p-8 rounded-[40px] shadow-sm">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Recovery Velocity</p>
                            <h5 className="text-3xl font-black text-text-main">
                                {analytics.recoveryVelocity.toFixed(1)}<span className="text-lg opacity-30">s</span>
                            </h5>
                            <p className="text-[10px] font-bold text-text-muted mt-1 italic">Avg time to correct mistakes</p>
                            <div className="mt-6 flex items-baseline gap-1">
                                <div className="w-2 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-t-sm" />
                                <div className="w-2 h-12 bg-emerald-200 dark:bg-emerald-800/40 rounded-t-sm" />
                                <div className="w-2 h-10 bg-emerald-500 rounded-t-sm" />
                                <div className="w-2 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-t-sm" />
                            </div>
                        </div>

                        <div className="bg-app-surface border border-app-border p-8 rounded-[40px] shadow-sm">
                            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Active Struggles</p>
                            <h5 className="text-3xl font-black text-text-main">
                                {analytics.struggleClusters.length}
                            </h5>
                            <p className="text-[10px] font-bold text-text-muted mt-1 italic">Atoms with accuracy &lt; 50%</p>
                            <div className="mt-6 flex gap-2">
                                {analytics.struggleClusters.slice(0, 3).map((_, i) => (
                                    <div key={i} className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-black text-[10px]">!</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Misconception Radar */}
                    <div className="h-fit">
                        <MisconceptionRadar logs={rawLogs.flatMap(s => s.logs || [])} />
                    </div>

                    {/* Bottom Section: The Strategic Deep Stream */}
                    <div className="h-fit">
                        <StrategicLogExplorer logs={rawLogs.flatMap(s => s.logs || []).slice(0, 50)} />
                    </div>

                </div>
            </div>
        </div>
    );
};
