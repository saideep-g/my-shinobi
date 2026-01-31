import React from 'react';
import { useAuth } from '@core/auth/AuthContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { Zap, ShieldCheck, User as UserIcon } from 'lucide-react';

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="px-2">
                <h3 className="text-2xl font-black text-text-main tracking-tight">System Constraints</h3>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Global Engine Overrides</p>
            </header>

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
