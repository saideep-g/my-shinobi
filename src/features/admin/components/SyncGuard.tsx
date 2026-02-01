import React from 'react';
import { useProgression } from '@core/engine/ProgressionContext';
import { Sparkles, RefreshCcw, AlertTriangle } from 'lucide-react';

/**
 * SYNC GUARD (Production Switch)
 * A floating bar that appears when administrative changes are pending.
 * Encourages explicit "Production Push" to Firestore.
 */
export const SyncGuard: React.FC = () => {
    const { isDirty, isSyncing, forceSyncToCloud } = useProgression();

    if (!isDirty && !isSyncing) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto bg-amber-500 text-white shadow-2xl shadow-amber-500/30 px-8 py-3 rounded-full flex items-center gap-6 animate-in slide-in-from-top-10 duration-500 border-2 border-white/20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        {isSyncing ? (
                            <RefreshCcw size={16} className="animate-spin" />
                        ) : (
                            <AlertTriangle size={16} />
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Production Sync Pending</p>
                        <p className="text-[9px] font-bold opacity-80 mt-1">Changes detected in local state</p>
                    </div>
                </div>

                <div className="h-8 w-px bg-white/20" />

                <button
                    onClick={() => forceSyncToCloud()}
                    disabled={isSyncing}
                    className="flex items-center gap-2 bg-white text-amber-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                >
                    <Sparkles size={14} />
                    {isSyncing ? "Pushing..." : "Push Changes to Cloud"}
                </button>
            </div>
        </div>
    );
};
