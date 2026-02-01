import React, { useState } from 'react';
import { useProgression } from '@core/engine/ProgressionContext';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { useAuth } from '@core/auth/AuthContext';
import { useTheme } from '@core/theme/ThemeContext';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { clsx } from 'clsx';
import { BadgeVault } from './BadgeVault';
import { AVATARS } from '../data/avatars';
import { LogOut, Settings, Camera, ShieldCheck, Lock, Sun, Moon, Award, Calendar } from 'lucide-react';

/**
 * HERO PROFILE
 * The student's personal identity and achievement hub.
 * Visualizes their rank, XP, streaks, and unlocked badges.
 */

interface Props {
    onViewHistory?: () => void;
}

export const HeroProfile: React.FC<Props> = ({ onViewHistory }) => {
    const { stats, updateProfileDetails } = useProgression();
    const { mastery } = useIntelligence();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);

    // Resolve current avatar from selection or default
    const currentAvatar = AVATARS.find(a => a.id === stats.avatarId) || AVATARS[0];

    const handleSelectAvatar = async (avatarId: string) => {
        console.log(`[Profile] Persisting avatar selection: ${avatarId}`);
        await updateProfileDetails({ avatarId });
        setIsEditingAvatar(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 pb-24 space-y-10 animate-in fade-in zoom-in-95 duration-700">

            {/* Identity Card */}
            <div className="bg-app-surface border border-app-border rounded-[48px] p-10 text-center relative overflow-hidden shadow-xl">
                {/* Decorative background element */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-app-primary/5 rounded-full blur-3xl" />

                <div className="absolute top-6 right-8 flex gap-3">
                    <button className="p-3 bg-app-bg text-text-muted hover:text-app-primary border border-app-border rounded-2xl transition-all hover:rotate-90 shadow-sm active:scale-95">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="relative inline-block mb-6 group">
                    <div className="w-28 h-28 rounded-[38px] bg-app-bg border-4 border-app-primary flex items-center justify-center overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500">
                        <img
                            src={currentAvatar.url}
                            alt="Student Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        onClick={() => setIsEditingAvatar(true)}
                        className="absolute -bottom-2 -right-2 p-3 bg-app-primary text-white rounded-2xl shadow-lg hover:scale-110 active:scale-90 transition-all border-4 border-app-surface"
                    >
                        <Camera size={16} />
                    </button>
                </div>

                <h2 className="text-3xl font-black text-text-main tracking-tight">{user?.displayName || "Young Shinobi"}</h2>
                <div className="flex justify-center mt-3">
                    <div className="px-5 py-1.5 bg-app-primary/10 text-app-primary border border-app-primary/20 rounded-full flex items-center gap-2">
                        <Award size={14} className="animate-pulse" />
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] italic">Hero Level {stats.heroLevel} Disciple</p>
                    </div>
                </div>
            </div>

            {/* Settings & Archive List */}
            <div className="bg-app-surface border border-app-border rounded-[40px] overflow-hidden shadow-sm">
                {/* Theme Toggle */}
                <div className="p-6 border-b border-app-border flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-app-bg rounded-2xl text-app-primary group-hover:rotate-12 transition-transform">
                            {theme === 'dark' ? <Moon size={22} /> : <Sun size={22} />}
                        </div>
                        <div>
                            <p className="font-black text-text-main">Night Mode</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Toggle app appearance</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`w-14 h-8 rounded-full transition-all relative border-2 ${theme === 'dark' ? 'bg-app-primary border-app-primary' : 'bg-app-bg border-app-border'
                            }`}
                    >
                        <div className={`absolute top-1 w-4.5 h-4.5 bg-white rounded-full shadow-md transition-all ${theme === 'dark' ? 'left-7' : 'left-1'
                            }`} />
                    </button>
                </div>

                {/* History Archive */}
                <button
                    onClick={onViewHistory}
                    className="w-full p-6 border-b border-app-border flex items-center justify-between group hover:bg-app-bg/50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-app-bg rounded-2xl text-violet-500 group-hover:scale-110 transition-transform">
                            <Calendar size={22} />
                        </div>
                        <div className="text-left">
                            <p className="font-black text-text-main">Past Adventures</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Review results & history</p>
                        </div>
                    </div>
                    <Settings size={18} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="w-full p-6 flex items-center gap-4 text-rose-500 hover:bg-rose-50/50 transition-colors group"
                >
                    <div className="p-3 bg-rose-500/10 rounded-2xl group-hover:rotate-12 transition-transform">
                        <LogOut size={22} />
                    </div>
                    <div className="text-left">
                        <p className="font-black">Sign Out</p>
                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Leave command center</p>
                    </div>
                </button>
            </div>

            {/* Learning Path Summary (Above Vault) */}
            <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.2em]">Learning Path</h3>
                    <span className="px-4 py-1 bg-app-primary/10 text-app-primary rounded-full text-[10px] font-black uppercase">Grade {stats.grade || 7}</span>
                </div>
                <div className="space-y-3">
                    {stats.assignedChapterIds?.length > 0 ? (
                        <p className="text-sm text-text-main font-medium">
                            Currently mastering <span className="text-app-primary font-black">{stats.assignedChapterIds.length}</span> chapters assigned by sensei.
                        </p>
                    ) : (
                        <p className="text-sm italic text-text-muted">No chapters currently assigned for this grade.</p>
                    )}
                </div>
            </div>

            {/* Achievement Vault Section */}
            <div className="space-y-6">
                <header className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                        <ShieldCheck size={20} className="text-app-accent" fill="currentColor" fillOpacity={0.1} />
                        Honors Vault
                    </h3>
                    <span className="text-[10px] font-black text-app-accent uppercase bg-app-accent/10 px-3 py-1 rounded-lg">
                        {stats.achievements?.length || 0} Badges
                    </span>
                </header>

                <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                    <BadgeVault unlocked={stats.achievements || []} />
                </div>
            </div>

            {/* Learning Path: School-Sync View */}
            <div className="space-y-6">
                <header className="flex items-center justify-between px-4">
                    <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] flex items-center gap-3">
                        <Lock size={20} className="text-app-primary" fill="currentColor" fillOpacity={0.1} />
                        Learning Path
                    </h3>
                    <span className="text-[10px] font-black text-app-primary uppercase bg-app-primary/10 px-3 py-1 rounded-lg">
                        Grade {stats.grade || 7}
                    </span>
                </header>

                <div className="space-y-4">
                    {getAllBundles().filter(b => b.grade === (stats.grade || 7)).map(bundle => (
                        <div key={bundle.id} className="bg-app-surface border border-app-border rounded-[40px] p-6 shadow-sm">
                            <h4 className="font-black text-text-main py-2 px-2 uppercase text-[10px] tracking-widest text-text-muted">{bundle.curriculum.name}</h4>
                            <div className="space-y-2 mt-4">
                                {bundle.curriculum.chapters.map(chapter => {
                                    const isActive = stats.assignedChapterIds?.includes(chapter.id);
                                    const allAtoms = chapter.atoms;
                                    const isMastered = allAtoms.every(a => (mastery[a.id] || 0) >= 0.85);

                                    let status: 'TEACHING' | 'COMPLETED' | 'LOCKED' = 'LOCKED';
                                    if (isMastered) status = 'COMPLETED';
                                    else if (isActive) status = 'TEACHING';

                                    return (
                                        <div key={chapter.id} className="flex items-center justify-between p-4 bg-app-bg/50 rounded-2xl border border-app-border group hover:border-app-primary/30 transition-colors">
                                            <span className="text-xs font-bold text-text-main truncate pr-4">{chapter.title}</span>
                                            <span className={clsx(
                                                "text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest",
                                                status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-600" :
                                                    status === 'TEACHING' ? "bg-app-primary/10 text-app-primary" :
                                                        "bg-app-bg text-text-muted"
                                            )}>
                                                {status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Core Statistics Board */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-app-surface border border-app-border p-8 rounded-[40px] text-center shadow-sm group transition-all">
                    <p className="text-4xl font-black text-text-main">{stats.powerPoints.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Total Power (XP)</p>
                </div>
                <div className="bg-app-surface border border-app-border p-8 rounded-[40px] text-center shadow-sm group transition-all">
                    <p className="text-4xl font-black text-text-main">{stats.streakCount}</p>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Day Training Streak</p>
                </div>
            </div>

            {/* Avatar Selector Modal */}
            {isEditingAvatar && (
                <div className="fixed inset-0 z-[200] bg-app-bg/60 backdrop-blur-xl flex items-end md:items-center justify-center p-6 animate-in fade-in duration-300">
                    <div
                        className="bg-app-surface w-full max-w-lg rounded-[48px] p-10 shadow-3xl border border-white/10 animate-in slide-in-from-bottom-20 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="mb-10">
                            <h2 className="text-2xl font-black text-text-main tracking-tight">Select Your Identity</h2>
                            <p className="text-sm text-text-muted font-medium mt-1">Unlock new masks by reaching higher Hero Levels.</p>
                        </header>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-10 overflow-y-auto max-h-[40vh] p-2 text-center">
                            {AVATARS.map((avatar) => {
                                const isLocked = stats.heroLevel < avatar.minLevel;
                                const isSelected = stats.avatarId === avatar.id;
                                return (
                                    <button
                                        key={avatar.id}
                                        disabled={isLocked}
                                        onClick={() => handleSelectAvatar(avatar.id)}
                                        className={`group relative aspect-square rounded-[32px] bg-app-bg border-2 flex items-center justify-center transition-all ${!isLocked
                                            ? isSelected ? 'border-app-primary scale-105 shadow-lg shadow-app-primary/20' : 'border-app-border hover:border-app-primary'
                                            : 'opacity-40 cursor-not-allowed bg-app-surface/50 border-app-border/10'
                                            }`}
                                    >
                                        {isLocked && <Lock size={16} className="absolute z-10 text-text-muted" />}
                                        <img
                                            src={avatar.url}
                                            alt={avatar.label}
                                            className={`w-14 h-14 object-cover ${isLocked ? 'grayscale' : ''}`}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setIsEditingAvatar(false)}
                            className="w-full py-6 text-text-muted font-black uppercase tracking-widest hover:text-text-main transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
