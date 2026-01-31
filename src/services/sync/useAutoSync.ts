import { useEffect } from 'react';
import { useSync } from '@core/database/SyncContext';
import { useAuth } from '@core/auth/AuthContext';
import { syncService } from './syncService';

/**
 * AUTO-SYNC HOOK
 * Automatically triggers cloud synchronization when student is online 
 * and authenticated, or after significant learning events.
 */

export const useAutoSync = () => {
    const { isOnline, triggerSync } = useSync();
    const { user } = useAuth();

    useEffect(() => {
        // We only attempt to sync if we have a connection and a valid user
        if (isOnline && user) {
            // 3-second debounce to allow any post-session local writes to stabilize
            const timer = setTimeout(() => {
                console.log("[AutoSync] Conditions met. Starting background sync...");
                syncService.syncToCloud(user.uid).then((success) => {
                    if (success) {
                        triggerSync(); // Updates the global SyncContext timestamp
                    }
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOnline, user, triggerSync]);
};
