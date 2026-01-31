import React, { useState } from 'react';
import { useProgression } from '@core/engine/ProgressionContext';
import { useAuth } from '@core/auth/AuthContext';
import { BadgeVault } from './BadgeVault';
import { AVATARS } from '../data/avatars';
import { LogOut, Settings, Camera, ShieldCheck, Lock } from 'lucide-react';

/**
 * HERO PROFILE
 * The student's personal identity and achievement hub.
 * Visualizes their rank, XP, streaks, and unlocked badges.
 */

export const HeroProfile: React.FC = () => {
    const { stats } = useProgression();
    const { user, logout } = useAuth();
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);

    return (
        <div className="max-w-2xl mx-auto p-6 pb-24 space-y-10 animate-in fade-in zoom-in-95 duration-700">

            {/* Identity Card */}
            <div className="bg-app-surface border border-app-border rounded-[48px] p-10 text-center relative overflow-hidden shadow-xl">
                {/* Decorative background element */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-app-primary/5 rounded-full blur-3xl" />

                <div className="absolute top-6 right-8">
                    <button className="p-3 bg-app-bg text-text-muted hover:text-app-primary border border-app-border rounded-2xl transition-all hover:rotate-90">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="relative inline-block mb-6 group">
                    <div className="w-28 h-28 rounded-[38px] bg-app-bg border-4 border-app-primary flex items-center justify-center overflow-hidden shadow-2xl transition-transform group-hover:scale-105 duration-500">
                        <img
                            src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.uid}
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
                    <div className="px-5 py-1.5 bg-app-primary/10 text-app-primary border border-app-primary/20 rounded-full">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] italic">Hero Level {stats.heroLevel} Disciple</p>
                    </div>
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

            {/* Core Statistics Board */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-app-surface border border-app-border p-8 rounded-[40px] text-center shadow-sm group hover:border-app-primary/40 transition-all">
                    <p className="text-4xl font-black text-text-main group-hover:scale-110 transition-transform">{stats.powerPoints.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Total Power (XP)</p>
                </div>
                <div className="bg-app-surface border border-app-border p-8 rounded-[40px] text-center shadow-sm group hover:border-orange-500/40 transition-all">
                    <p className="text-4xl font-black text-text-main group-hover:scale-110 transition-transform">{stats.streakCount}</p>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Day Training Streak</p>
                </div>
            </div>

            {/* Exit Path */}
            <div className="pt-4">
                <button
                    onClick={logout}
                    className="w-full py-6 flex items-center justify-center gap-3 text-rose-500 font-black uppercase tracking-[0.2em] text-xs hover:bg-rose-50 rounded-[28px] border-2 border-transparent hover:border-rose-100 transition-all"
                >
                    <LogOut size={20} /> Leave Command Center
                </button>
            </div>

            {/* Avatar Selector Modal */}
            {isEditingAvatar && (
                <div className="fixed inset-0 z-[200] bg-app-bg/60 backdrop-blur-xl flex items-end md:items-center justify-center p-6 animate-in fade-in duration-300">
                    <div
                        className="bg-app-surface w-full max-w-lg rounded-[48px] p-10 shadow-3xl border border-white/10 animate-in slide-in-from-bottom-20 duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="mb-10">
                            <h4 className="text-2xl font-black text-text-main tracking-tight">Select Your Identity</h4>
                            <p className="text-sm text-text-muted font-medium mt-1">Unlock new masks by reaching higher Hero Levels.</p>
                        </header>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-10">
                            {AVATARS.map((avatar) => {
                                const isLocked = stats.heroLevel < avatar.minLevel;
                                return (
                                    <button
                                        key={avatar.id}
                                        disabled={isLocked}
                                        className={`group relative aspect-square rounded-[32px] bg-app-bg border-2 flex items-center justify-center transition-all ${!isLocked
                                                ? 'border-app-border hover:border-app-primary hover:scale-105 hover:shadow-xl'
                                                : 'opacity-40 cursor-not-allowed bg-app-surface/50 border-app-border/10'
                                            }`}
                                        title={isLocked ? `Required level: ${avatar.minLevel}` : avatar.label}
                                    >
                                        {isLocked && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 text-text-muted">
                                                <Lock size={20} />
                                            </div>
                                        )}
                                        <img
                                            src={avatar.url}
                                            alt={avatar.label}
                                            className={`w-14 h-14 object-cover ${isLocked ? 'grayscale' : ''}`}
                                        />
                                        {!isLocked && (
                                            <p className="absolute -bottom-10 left-0 right-0 text-[8px] font-black uppercase text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap overflow-hidden">
                                                {avatar.label}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setIsEditingAvatar(false)}
                            className="w-full py-6 bg-app-primary text-white rounded-[24px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-app-primary/30"
                        >
                            Confirm Selection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
