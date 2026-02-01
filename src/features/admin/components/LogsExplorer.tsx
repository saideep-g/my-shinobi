import React, { useEffect, useState } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { Search, User as UserIcon, RefreshCcw, Activity, Clock, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface UserStats {
    id: string;
    displayName: string;
    heroLevel: number;
}

/**
 * LOGS EXPLORER
 * A standalone intelligence feed for tracking AI selection rationales and session history.
 * Fixed for dark mode visibility and high legibility.
 */
export const LogsExplorer: React.FC = () => {
    const [users, setUsers] = useState<UserStats[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [userSessions, setUserSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const allStats = await dbAdapter.getAll<UserStats>('stats');
            setUsers(allStats);
            if (allStats.length > 0 && !selectedUserId) {
                setSelectedUserId(allStats[0].id);
            }
        } catch (error) {
            console.error("[LogsExplorer] Failed to load users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSessions = async (uid: string) => {
        setIsRefreshing(true);
        try {
            const sessions = await dbAdapter.getSessionsForUser(uid);
            setUserSessions(sessions.sort((a, b) => b.startTime - a.startTime));
        } catch (error) {
            console.error("[LogsExplorer] Failed to load sessions:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            loadSessions(selectedUserId);
        }
    }, [selectedUserId]);

    const filteredUsers = users.filter(u =>
        (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedUser = users.find(u => u.id === selectedUserId);

    if (isLoading) {
        return <div className="p-20 text-center animate-pulse font-black text-text-muted">Decoding Intelligence Feed...</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-160px)] animate-in fade-in duration-700">
            {/* 1. User Sidebar Picker */}
            <aside className="lg:w-80 space-y-6">
                <div className="bg-app-surface border border-app-border rounded-[32px] p-6 shadow-sm">
                    <header className="mb-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-text-main">Shinobi Roster</h4>
                    </header>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                        <input
                            type="text"
                            placeholder="Find student..."
                            className="w-full bg-app-bg border border-app-border rounded-xl py-2 pl-9 pr-4 text-xs font-bold focus:ring-2 focus:ring-app-primary/20 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {filteredUsers.map(user => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUserId(user.id)}
                                className={clsx(
                                    "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
                                    selectedUserId === user.id
                                        ? "bg-app-primary border-app-primary text-white shadow-lg shadow-app-primary/20"
                                        : "bg-app-bg border-app-border text-text-muted hover:border-app-primary/30 hover:text-text-main"
                                )}
                            >
                                <div className={clsx(
                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                    selectedUserId === user.id ? "bg-white/20" : "bg-app-surface"
                                )}>
                                    <UserIcon size={16} />
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-[11px] font-black leading-tight truncate">{user.displayName || "Anonymous"}</p>
                                    <p className={clsx("text-[8px] font-black uppercase tracking-tighter mt-0.5", selectedUserId === user.id ? "text-white/70" : "text-text-muted")}>
                                        Lvl {user.heroLevel} • {user.id.slice(0, 8)}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* 2. Main Logs Display */}
            <main className="flex-1 space-y-8">
                {selectedUser ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <header className="flex justify-between items-end">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/20">
                                        Intelligence Archive
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black tracking-tight text-text-main">
                                    Logs Explorer <span className="text-text-muted font-normal">/ {selectedUser.displayName}</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => loadSessions(selectedUserId!)}
                                disabled={isRefreshing}
                                className="p-3 bg-app-surface border border-app-border rounded-2xl text-text-muted hover:text-app-primary transition-all shadow-sm"
                            >
                                <RefreshCcw size={18} className={clsx(isRefreshing && "animate-spin")} />
                            </button>
                        </header>

                        <div className="space-y-6">
                            {userSessions.length === 0 ? (
                                <div className="bg-app-surface border border-app-border border-dashed rounded-[40px] p-20 text-center">
                                    <Clock className="mx-auto text-text-muted opacity-20 mb-4" size={48} />
                                    <h3 className="text-xl font-black text-text-muted">No History Found</h3>
                                    <p className="text-xs font-bold text-text-muted/60 uppercase tracking-widest mt-2 px-10">This shinobi has not engaged in any training sessions yet.</p>
                                </div>
                            ) : (
                                userSessions.map((session) => (
                                    <div key={session.id} className="bg-app-surface border border-app-border rounded-[40px] overflow-hidden shadow-sm">
                                        <header className="px-8 py-5 bg-app-bg/40 border-b border-app-border flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                    <Zap size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Session: {session.type}</p>
                                                    <p className="text-xs font-bold text-text-main">{new Date(session.startTime).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">Yield</p>
                                                <p className="text-lg font-black text-emerald-500">+{session.pointsGained} XP</p>
                                            </div>
                                        </header>

                                        <div className="p-8 space-y-6">
                                            {session.logs.filter((l: any) => l.selectionRationale).map((log: any, idx: number) => (
                                                <div key={idx} className="flex gap-6 group">
                                                    <div className="flex flex-col items-center gap-2 mt-1">
                                                        <div className={clsx(
                                                            "w-3 h-3 rounded-full shadow-sm ring-4",
                                                            log.isCorrect
                                                                ? "bg-emerald-500 ring-emerald-500/10"
                                                                : "bg-rose-500 ring-rose-500/10"
                                                        )} />
                                                        <div className="w-0.5 flex-1 bg-app-border group-last:bg-transparent" />
                                                    </div>
                                                    <div className="flex-1 pb-6 border-b border-app-border group-last:border-0">
                                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className="px-3 py-1 bg-app-bg border border-app-border rounded-lg text-[9px] font-black uppercase text-text-muted">
                                                                    QID: {log.questionId.slice(0, 12)}
                                                                </span>
                                                                <span className={clsx(
                                                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase",
                                                                    log.isCorrect ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                                )}>
                                                                    {log.isCorrect ? "CLEARED" : "FAILED"}
                                                                </span>
                                                            </div>
                                                            <div className="bg-app-bg px-4 py-1.5 rounded-xl border border-app-border flex items-center gap-3">
                                                                <Activity size={12} className="text-app-primary" />
                                                                <span className="text-[10px] font-black text-text-main">
                                                                    {log.masteryBefore.toFixed(2)} <span className="text-text-muted mx-1">→</span> {log.masteryAfter.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="bg-app-bg/60 p-5 rounded-2xl border border-app-border/50 relative overflow-hidden group-hover:border-app-primary/30 transition-all">
                                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-app-primary/10" />
                                                            <p className="text-xs font-bold text-text-main dark:text-text-main leading-relaxed italic">
                                                                "{log.selectionRationale}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {session.logs.every((l: any) => !l.selectionRationale) && (
                                                <div className="flex flex-col items-center justify-center py-8 text-center bg-app-bg/30 rounded-3xl border border-app-border border-dashed">
                                                    <Activity className="text-text-muted opacity-30 mb-3" size={32} />
                                                    <p className="text-[10px] text-text-muted font-black uppercase tracking-widest italic">
                                                        Deep rationale not logged for this session.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-app-surface border border-app-border border-dashed rounded-[48px]">
                        <Activity className="text-text-muted opacity-20 mb-6" size={64} />
                        <h3 className="text-2xl font-black text-text-muted">Decoder Waiting...</h3>
                        <p className="text-sm font-bold text-text-muted/60 uppercase tracking-widest mt-3 max-w-sm">Select a student from the Shinobi Roster to decode their intelligence feed.</p>
                    </div>
                )}
            </main>
        </div>
    );
};
