import React from 'react';
import { useAuth } from './AuthContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { Skeleton, CardSkeleton } from '@shared/components/ui/Skeleton';

/**
 * LOADING GUARD
 * Prevents the application from rendering "Flash of Empty Content" (FOEC).
 * * Waits for Firebase Auth and local database hydration.
 */

export const LoadingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isInitializing, user } = useAuth();
    const { stats } = useProgression();

    // 1. Initial Identity Check
    if (isInitializing) {
        return (
            <div className="min-h-screen bg-app-bg flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-app-primary rounded-[32px] animate-bounce shadow-2xl shadow-app-primary/40 flex items-center justify-center text-white text-3xl font-black italic">
                    MS
                </div>
                <div className="mt-12 space-y-4 w-full max-w-xs text-center">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-4">Initializing Shinobi Engine</p>
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-2 w-2/3 mx-auto rounded-full opacity-60" />
                </div>
            </div>
        );
    }

    // 2. Data Hydration Check
    // If we have a user but stats aren't loaded yet (lastActiveDate is empty), show the "Shell Skeleton"
    if (user && !stats.lastActiveDate) {
        return (
            <div className="min-h-screen bg-app-bg animate-in fade-in duration-700">
                {/* Mock Header */}
                <div className="p-6 border-b border-app-border flex justify-between items-center bg-app-surface/30">
                    <Skeleton className="w-12 h-12 rounded-2xl" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                </div>

                <main className="max-w-md mx-auto p-6 space-y-8 mt-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/2 rounded-xl" />
                        <Skeleton className="h-4 w-1/3 rounded-lg opacity-60" />
                    </div>

                    <CardSkeleton />

                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-32 rounded-[32px]" />
                        <Skeleton className="h-32 rounded-[32px]" />
                    </div>

                    <div className="space-y-6 pt-10 flex flex-col items-center">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-6 w-full">
                                <Skeleton className="w-20 h-20 rounded-[2.5rem] shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-5 w-3/4 rounded-lg" />
                                    <Skeleton className="h-4 w-1/2 rounded-lg opacity-40" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        );
    }

    return <>{children}</>;
};
