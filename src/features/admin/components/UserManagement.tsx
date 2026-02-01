import React, { useEffect, useState } from 'react';
import { useProgression } from '@core/engine/ProgressionContext';
import { dbAdapter } from '@core/database/adapter';
import { StudentStats } from '@/types/progression';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { BookOpen, GraduationCap, CheckCircle2, Circle, Users, User as UserIcon, ShieldCheck, Smartphone, Map, Save, CloudUpload, RefreshCw, RefreshCcw, Search } from 'lucide-react';
import { userService } from '@services/db/userService';
import { clsx } from 'clsx';

interface UserStats extends StudentStats {
    id: string;
}

export const UserManagement: React.FC = () => {
    const { stats: currentAdminStats, updateProfileDetails, isDirty, setIsDirty, saveChangesToCloud } = useProgression();
    const [allUsers, setAllUsers] = useState<UserStats[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [subTab, setSubTab] = useState<'settings' | 'logs'>('settings');
    const [userSessions, setUserSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Load sessions for the selected user
    useEffect(() => {
        if (!selectedUserId) return;
        const loadSessions = async () => {
            const sessions = await dbAdapter.getSessionsForUser(selectedUserId);
            setUserSessions(sessions.sort((a, b) => b.startTime - a.startTime));
        };
        loadSessions();
    }, [selectedUserId]);

    const handleSave = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        try {
            await saveChangesToCloud(selectedUser.id, selectedUser);
            // On success, isDirty is cleared inside the context
        } catch (error) {
            console.error("[UserManagement] Failed to sync selected user:", error);
            // Error handling could show a toast here
        } finally {
            setIsSaving(false);
        }
    };

    // Current context stats don't always have ID visible in the same way, but we know uid from auth
    const adminId = (currentAdminStats as any).id || '';

    const loadUsers = async (forceRefresh = false) => {
        if (forceRefresh) setIsRefreshing(true);
        try {
            if (forceRefresh) {
                await userService.syncRosterFromCloud();
            }
            const users = await dbAdapter.getAll<UserStats>('stats');
            setAllUsers(users);
            if (users.length > 0 && !selectedUserId) {
                // Default to current admin or first user
                setSelectedUserId(adminId || users[0].id);
            }
        } catch (error) {
            console.error("[UserManagement] Load failed:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Load all local users on mount
    useEffect(() => {
        loadUsers(true); // Sync on mount to get latest users
    }, [adminId]);

    const selectedUser = allUsers.find(u => u.id === selectedUserId);

    const handleToggleChapter = async (chapterId: string) => {
        if (!selectedUser) return;

        const current = selectedUser.assignedChapterIds || [];
        const next = current.includes(chapterId)
            ? current.filter(id => id !== chapterId)
            : [...current, chapterId];

        const updatedUser = { ...selectedUser, assignedChapterIds: next };

        // Save to DB
        await dbAdapter.put('stats', updatedUser);

        // Update local state
        setAllUsers(prev => prev.map(u => u.id === selectedUserId ? updatedUser : u));

        // Mark as unsaved
        setIsDirty(true);

        // If managing self, also update current context
        if (selectedUserId === adminId) {
            await updateProfileDetails({ assignedChapterIds: next });
        }
    };

    const handleSetGrade = async (grade: number) => {
        if (!selectedUser) return;

        const updatedUser = { ...selectedUser, grade };

        // Save to DB
        await dbAdapter.put('stats', updatedUser);

        // Update local state
        setAllUsers(prev => prev.map(u => u.id === selectedUserId ? updatedUser : u));

        // Mark as unsaved
        setIsDirty(true);

        // If managing self, also update current context
        if (selectedUserId === adminId) {
            await updateProfileDetails({ grade });
        }
    };

    const handleSetLayout = async (layout: 'quest' | 'era') => {
        if (!selectedUser) return;

        const updatedUser = { ...selectedUser, preferredLayout: layout };

        // Save to DB
        await dbAdapter.put('stats', updatedUser);

        // Update local state
        setAllUsers(prev => prev.map(u => u.id === selectedUserId ? updatedUser : u));

        // Mark as unsaved
        setIsDirty(true);

        // If managing self, also update current context
        if (selectedUserId === adminId) {
            await updateProfileDetails({ preferredLayout: layout });
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse font-black text-text-muted">Loading Shinobi Scrolls...</div>;
    }

    return (
        <div className="space-y-10 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. User Selection Header */}
            <section className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-black flex items-center gap-3">
                            <Users className="text-indigo-500" /> Roster Management
                        </h4>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Select a student to modify their learning path</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => loadUsers(true)}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
                        >
                            <RefreshCcw size={14} className={clsx(isRefreshing && "animate-spin")} />
                            {isRefreshing ? "Syncing..." : "Sync Roster"}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {allUsers.map(user => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUserId(user.id)}
                            className={clsx(
                                "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center group",
                                selectedUserId === user.id
                                    ? "border-app-primary bg-app-primary/5 shadow-lg shadow-app-primary/10"
                                    : "border-app-border bg-app-bg hover:border-app-primary/30"
                            )}
                        >
                            <div className={clsx(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                selectedUserId === user.id ? "bg-app-primary text-white" : "bg-app-surface text-text-muted"
                            )}>
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <p className="font-black text-xs text-text-main truncate w-24">
                                    {user.displayName || "Young Shinobi"}
                                </p>
                                <p className="text-[8px] font-black text-text-muted uppercase tracking-wider mt-0.5">
                                    Lvl {user.heroLevel}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {selectedUser && (
                <div className="space-y-12 animate-in fade-in duration-500">
                    {/* 2. Selected User Badge & Tab Switcher */}
                    <div className="bg-app-surface border border-app-border rounded-[40px] overflow-hidden shadow-sm">
                        <div className="px-8 py-6 bg-app-primary/10 border-b border-app-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-app-primary" size={28} />
                                <div>
                                    <p className="text-[10px] font-black text-app-primary uppercase tracking-[0.2em] mb-0.5">Currently Managing</p>
                                    <p className="text-2xl font-black text-text-main leading-none">
                                        {selectedUser.displayName} <span className="text-text-muted font-black opacity-30 ml-2">#{selectedUser.id.slice(0, 8)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1 bg-white/50 p-1 rounded-2xl border border-app-border items-center">
                                <button
                                    onClick={() => setSubTab('settings')}
                                    className={clsx(
                                        "px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2",
                                        subTab === 'settings' ? "bg-app-primary text-white shadow-lg" : "text-text-muted hover:bg-white hover:text-text-main"
                                    )}
                                >
                                    <ShieldCheck size={14} /> Settings
                                </button>
                                <button
                                    onClick={() => setSubTab('logs')}
                                    className={clsx(
                                        "px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2",
                                        subTab === 'logs' ? "bg-app-primary text-white shadow-lg" : "text-text-muted hover:bg-white hover:text-text-main"
                                    )}
                                >
                                    <Search size={14} /> Logs Explorer
                                </button>
                            </div>
                        </div>

                        {subTab === 'logs' ? (
                            <div className="p-10 space-y-8 animate-in fade-in duration-500">
                                <header className="flex justify-between items-center">
                                    <div>
                                        <h5 className="text-lg font-black italic">Intelligence Feed</h5>
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">AI Selection Rationales & Session History</p>
                                    </div>
                                </header>

                                {userSessions.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-app-border rounded-[40px] text-text-muted font-black uppercase text-xs">
                                        No practice sessions found for this user.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {userSessions.slice().reverse().map(session => (
                                            <div key={session.id} className="bg-app-bg/50 border border-app-border rounded-[32px] overflow-hidden">
                                                <header className="px-6 py-4 border-b border-app-border flex justify-between items-center bg-white/30">
                                                    <div className="flex items-center gap-4">
                                                        <div className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-[9px] font-black uppercase">
                                                            {session.type}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-text-muted">
                                                            {new Date(session.startTime).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-black text-emerald-500">+{session.pointsGained} XP</span>
                                                </header>
                                                <div className="p-6 space-y-4">
                                                    {session.logs.filter((l: any) => l.selectionRationale).map((log: any, idx: number) => (
                                                        <div key={idx} className="flex gap-4 group">
                                                            <div className="flex flex-col items-center gap-1 mt-1">
                                                                <div className={clsx(
                                                                    "w-2 h-2 rounded-full",
                                                                    log.isCorrect ? "bg-emerald-500" : "bg-rose-500"
                                                                )} />
                                                                <div className="w-px flex-1 bg-app-border" />
                                                            </div>
                                                            <div className="flex-1 pb-4 border-b border-app-border/30 last:border-0">
                                                                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1 flex items-center justify-between">
                                                                    Question #{log.questionId.slice(0, 6)}
                                                                    <span>{log.masteryBefore.toFixed(2)} → {log.masteryAfter.toFixed(2)} Mastery</span>
                                                                </p>
                                                                <p className="text-xs font-medium text-text-main italic border-l-2 border-app-primary/20 pl-4 py-1">
                                                                    "{log.selectionRationale}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {session.logs.every((l: any) => !l.selectionRationale) && (
                                                        <p className="text-[10px] text-center text-text-muted font-bold italic py-4">
                                                            Standard progression logs (No deep rationale available for this session).
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-10 space-y-12">
                                {/* 3. Grade Setup & Insight (Desktop Grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                                    <section className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm col-span-1 border-opacity-50">
                                        <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                                            <GraduationCap className="text-app-primary" /> Grade Assignment
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[2, 7].map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => handleSetGrade(g)}
                                                    className={clsx(
                                                        "py-4 rounded-2xl font-black border-2 transition-all active:scale-95",
                                                        selectedUser.grade === g
                                                            ? "bg-app-primary border-app-primary text-white shadow-lg shadow-app-primary/20"
                                                            : "bg-app-bg border-app-border text-text-muted hover:border-app-primary/30"
                                                    )}
                                                >
                                                    Grade {g}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="mt-6 text-[10px] text-text-muted font-black uppercase tracking-widest leading-relaxed">
                                            Current selection: Grade {selectedUser.grade}
                                        </p>
                                    </section>

                                    <div className="md:col-span-2 p-10 bg-app-primary/5 border border-app-primary/10 rounded-[40px] flex flex-col justify-center h-full">
                                        <h4 className="text-lg font-black text-app-primary uppercase tracking-widest mb-4 italic">Sensei Insight</h4>
                                        <p className="text-base text-text-main leading-relaxed font-medium">
                                            Toggle school chapters below. The Shinobi will only see questions from <b className="text-app-primary">Assigned</b> chapters that also meet their Bayesian prerequisite requirements (mastery {">"} 85%).
                                        </p>
                                        <div className="mt-6 flex items-center gap-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-app-primary" /> Active Practice</span>
                                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full border border-app-border" /> Archived Content</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. Layout Preference (Visual Cards) */}
                                <section className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm border-opacity-50">
                                    <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                                        <Smartphone className="text-app-primary" /> Training Intent
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <button
                                            onClick={() => handleSetLayout('quest')}
                                            className={clsx(
                                                "p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 text-center group",
                                                selectedUser.preferredLayout === 'quest'
                                                    ? "border-app-primary bg-app-primary/5 shadow-xl shadow-app-primary/10"
                                                    : "border-app-border bg-app-bg text-text-muted hover:border-app-primary/30"
                                            )}
                                        >
                                            <Smartphone size={40} className={clsx("transition-transform group-hover:scale-110", selectedUser.preferredLayout === 'quest' ? "text-app-primary" : "text-text-muted")} />
                                            <div>
                                                <p className="font-black text-sm text-text-main">Mobile Question</p>
                                                <p className="text-[9px] font-black uppercase tracking-wider opacity-60 mt-1">Vertical High-Speed Practice</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => handleSetLayout('era')}
                                            className={clsx(
                                                "p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 text-center group",
                                                selectedUser.preferredLayout === 'era'
                                                    ? "border-app-primary bg-app-primary/5 shadow-xl shadow-app-primary/10"
                                                    : "border-app-border bg-app-bg text-text-muted hover:border-app-primary/30"
                                            )}
                                        >
                                            <Map size={40} className={clsx("transition-transform group-hover:scale-110", selectedUser.preferredLayout === 'era' ? "text-app-primary" : "text-text-muted")} />
                                            <div>
                                                <p className="font-black text-sm text-text-main">Student Era</p>
                                                <p className="text-[9px] font-black uppercase tracking-wider opacity-60 mt-1">Library Search & Discovery</p>
                                            </div>
                                        </button>
                                    </div>
                                </section>

                                {/* 5. Chapter Assignment Grid (Desktop 2-column) */}
                                <section className="space-y-8">
                                    <h4 className="text-xl font-black flex items-center gap-3 px-2">
                                        <BookOpen className="text-app-accent" /> Master Curriculum Sync
                                    </h4>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {getAllBundles().map(bundle => (
                                            <div key={bundle.id} className={clsx(
                                                "bg-app-surface border transition-all rounded-[40px] overflow-hidden shadow-sm flex flex-col",
                                                bundle.grade === selectedUser.grade ? "border-app-primary/30 ring-1 ring-app-primary/10" : "border-app-border"
                                            )}>
                                                <header className="bg-app-bg/50 p-8 border-b border-app-border flex justify-between items-center">
                                                    <div>
                                                        <p className="font-black text-app-primary uppercase tracking-widest text-[10px] mb-1">{bundle.subjectId}</p>
                                                        <h5 className="font-black text-2xl tracking-tight">{bundle.curriculum.name}</h5>
                                                    </div>
                                                    <div className={clsx(
                                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                        bundle.grade === selectedUser.grade
                                                            ? "bg-app-primary/10 text-app-primary border-app-primary/20"
                                                            : "bg-app-bg text-text-muted border-app-border"
                                                    )}>
                                                        Grade {bundle.grade}
                                                    </div>
                                                </header>
                                                <div className="p-6 grid gap-3 overflow-y-auto max-h-[500px] custom-scrollbar">
                                                    {bundle.curriculum.chapters.map(chapter => {
                                                        const isAssigned = selectedUser.assignedChapterIds?.includes(chapter.id);
                                                        return (
                                                            <button
                                                                key={chapter.id}
                                                                onClick={() => handleToggleChapter(chapter.id)}
                                                                className={clsx(
                                                                    "flex items-center justify-between p-5 rounded-[24px] border transition-all active:scale-[0.98] group",
                                                                    isAssigned
                                                                        ? 'border-app-primary bg-app-primary/5 shadow-sm shadow-app-primary/5'
                                                                        : 'border-app-border opacity-70 hover:opacity-100 hover:border-app-primary/30'
                                                                )}
                                                            >
                                                                <div className="text-left">
                                                                    <p className="font-bold text-base text-text-main group-hover:text-app-primary transition-colors">{chapter.title}</p>
                                                                    <p className="text-[10px] uppercase font-black opacity-40 mt-1">{chapter.atoms.length} Knowledge Atoms</p>
                                                                </div>
                                                                {isAssigned ? (
                                                                    <CheckCircle2 className="text-app-primary" size={24} />
                                                                ) : (
                                                                    <Circle className="text-text-muted group-hover:text-app-primary transition-colors" size={24} />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Immediate Save Action Bar (Sticky at bottom) */}
            {isDirty && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-app-surface border-2 border-app-primary p-4 rounded-[32px] shadow-2xl flex items-center gap-8 animate-in slide-in-from-bottom-10 border-opacity-50 backdrop-blur-xl">
                    <div className="pl-2">
                        <p className="text-xs font-black uppercase tracking-widest text-app-primary flex items-center gap-2">
                            <CloudUpload size={14} /> Unsaved Settings
                        </p>
                        <p className="text-[10px] text-text-muted font-bold opacity-70">Changes detected in learning path.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-app-primary text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-app-primary/30 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? "Syncing..." : "Save to Cloud"}
                    </button>
                </div>
            )}
        </div>
    );
};
