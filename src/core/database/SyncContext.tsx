import React, { createContext, useContext, useEffect, useState } from 'react';

interface SyncContextType {
    isOnline: boolean;
    lastSyncTime: number | null;
    triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const triggerSync = async () => {
        if (!isOnline) {
            console.warn('Cannot sync: Offline');
            return;
        }
        console.log('Syncing IndexedDB to Firestore...');
        // Actual implementation comes in Phase 5 & 28
        setLastSyncTime(Date.now());
    };

    return (
        <SyncContext.Provider value={{ isOnline, lastSyncTime, triggerSync }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (!context) throw new Error('useSync must be used within a SyncProvider');
    return context;
};
