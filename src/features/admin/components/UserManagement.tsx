import React from 'react';
import { useAuth } from '@core/auth/AuthContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { Zap, ShieldCheck, User as UserIcon, BookOpen, Check, X } from 'lucide-react';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { clsx } from 'clsx';

/**
 * USER MANAGEMENT (Admin Tool)
 * Allows the manager to override session lengths for testing or quick review.
 * Syncs with the new sessionLimit logic in the Selection Engine.
 */

export const UserManagement: React.FC = () => {
    const { user } = useAuth();
    const { stats, updateProfileDetails } = useProgression();

    const isSpeedRunActive = stats.sessionConfig?.questionsPerSession === 3;

    const handleToggleSpeedRun = async () => {
        const newLimit = isSpeedRunActive ? 20 : 3;
        console.log(`[Admin] Toggling Speed Run Mode: Setting limit to ${newLimit}`);

        await updateProfileDetails({
            sessionConfig: {
                questionsPerSession: newLimit,
                isDeveloperMode: newLimit === 3
            }
        });
    };

    const handleToggleChapter = async (chapterId: string) => {
        const currentActive = stats.activeChapterIds || [];
        const isCurrentlyActive = currentActive.includes(chapterId);

        let newActive;
        if (isCurrentlyActive) {
            newActive = currentActive.filter(id => id !== chapterId);
        } else {
            newActive = [...currentActive, chapterId];
        }

        console.log(`[Admin] Updating Chapter Assignments: ${newActive.join(', ')}`);
        await updateProfileDetails({ activeChapterIds: newActive });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="px-2">
                <h3 className="text-2xl font-black text-text-main tracking-tight">System Constraints</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Global Engine Overrides</p>
            </header>

            {/* 1. School-Sync: Chapter Controller */}
            <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                <h4 className="flex items-center gap-3 text-sm font-black text-text-main uppercase tracking-widest mb-6">
                    <BookOpen size={18} className="text-app-primary" />
                    School-Sync: Chapter Assignment
                </h4>

                <div className="grid gap-4">
                    {getAllBundles().filter(b => b.grade === (stats.grade || 7)).map(bundle => (
                        <div key={bundle.id} className="space-y-4">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-2">{bundle.curriculum.name}</p>
                            <div className="space-y-2">
                                {bundle.curriculum.chapters.map(chapter => {
                                    const isActive = stats.activeChapterIds?.includes(chapter.id);
                                    return (
                                        <div key={chapter.id} className="flex items-center justify-between p-4 bg-app-bg/50 rounded-2xl border border-app-border">
                                            <span className="text-xs font-bold text-text-main">{chapter.title}</span>
                                            <button
                                                onClick={() => handleToggleChapter(chapter.id)}
                                                className={clsx(
                                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95",
                                                    isActive
                                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                                        : "bg-app-bg border border-app-border text-text-muted"
                                                )}
                                            >
                                                {isActive ? <Check size={14} /> : <X size={14} />}
                                                {isActive ? "Active" : "Disabled"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl transition-all duration-500 ${isSpeedRunActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 rotate-12' : 'bg-app-bg text-text-muted border border-app-border'}`}>
                            <Zap size={28} fill={isSpeedRunActive ? "currentColor" : "none"} />
                        </div>
                        <div>
                            <p className="font-black text-lg text-text-main">Developer Speed Run</p>
                            <p className="text-xs font-medium text-text-muted mt-0.5">
                                {isSpeedRunActive
                                    ? "Fast Mode: Sessions capped at 3 questions."
                                    : "Standard Mode: Sessions capped at 20 questions."}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggleSpeedRun}
                        className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl ${isSpeedRunActive
                            ? 'bg-rose-500 text-white shadow-rose-500/20'
                            : 'bg-app-primary text-white shadow-app-primary/20'
                            }`}
                    >
                        {isSpeedRunActive ? "Turn Off" : "Enable 3-Q Mode"}
                    </button>
                </div>
            </div>

            {/* Visual Diagnostics (Admin Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-app-surface border border-app-border rounded-[40px] p-8 flex items-center gap-5 shadow-sm">
                    <div className="p-4 bg-app-bg text-app-primary rounded-2xl">
                        <UserIcon size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Active Identity</p>
                        <p className="font-bold text-text-main">{user?.displayName || "System Manager"}</p>
                    </div>
                </div>

                <div className="bg-app-surface border border-app-border rounded-[40px] p-8 flex items-center gap-5 shadow-sm">
                    <div className="p-4 bg-app-bg text-app-accent rounded-2xl">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Access Level</p>
                        <p className="font-bold text-text-main">Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
