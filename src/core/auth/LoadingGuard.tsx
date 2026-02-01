import React from 'react';
import { useAuth } from './AuthContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { Skeleton } from '@shared/components/ui/Skeleton';

/**
 * LOADING GUARD
 * Prevents the application from rendering "Flash of Empty Content" (FOEC).
 * * Waits for Firebase Auth and local database hydration.
 */

export const LoadingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isInitializing, user } = useAuth();
    const { stats, isLoaded } = useProgression();

    // 1. Initial Identity Check
    if (isInitializing) {
        return (
            <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-app-primary rounded-[32px] animate-bounce shadow-2xl shadow-app-primary/40 flex items-center justify-center text-white text-3xl font-black italic">
                    MS
                </div>
                <div className="mt-12 space-y-4 w-full max-w-xs text-center">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-4">Initializing Identity</p>
                    <Skeleton className="h-2 w-full rounded-full" />
                </div>
            </div>
        );
    }

    // 2. Data Hydration Check
    if (user && (!isLoaded || !stats.lastActiveDate)) {
        return (
            <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Hydrating Hero Stats...</p>
            </div>
        );
    }

    if (user) {
        console.log(`[Guard] Flowing to children. Layout: ${stats.preferredLayout}`);
    }

    return <>{children}</>;
};
