import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { useAuth } from '@core/auth/AuthContext';
import { calculateLevel } from './progression';
import { StudentStats, Achievement, MasteryMap } from '@/types/progression';
import { useIntelligence } from './IntelligenceContext';
import { checkNewAchievements } from './achievements/achievementEngine';
import { syncService } from '@services/sync/syncService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@core/database/firebase';

/**
 * PROGRESSION CONTEXT
 * Tracks Power Points (XP), Hero Levels, and Engagement Streaks.
 * Acts as the student's personal record keeper.
 */

interface ProgressionContextType {
    stats: StudentStats;
    addXP: (amount: number) => Promise<void>;
    updateStreak: () => Promise<void>;
    checkForAchievements: () => Promise<Achievement[]>;
    updateStats: (updates: Partial<StudentStats>) => Promise<void>;
    updateProfileDetails: (updates: Partial<StudentStats>) => Promise<void>;
    saveChangesToCloud: (userId?: string, statsToSync?: StudentStats) => Promise<void>;
    forceSyncToCloud: () => Promise<void>;
    isDirty: boolean;
    setIsDirty: (dirty: boolean) => void;
    isLoaded: boolean;
    isSyncing: boolean;
}


const DEFAULT_STATS: StudentStats = {
    powerPoints: 0,
    heroLevel: 1,
    streakCount: 0,
    lastActiveDate: '', // Empty initially for hydration check
    activityLog: [],
    preferredLayout: 'quest',
    sessionConfig: {
        questionsPerSession: 20,
        isDeveloperMode: false
    },
    grade: 7,
    assignedChapterIds: []
};

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { mastery } = useIntelligence();
    const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // 1. Load historical stats from IndexedDB on startup/auth change
    useEffect(() => {
        const loadStats = async () => {
            if (!user) {
                setStats(DEFAULT_STATS);
                setIsLoaded(false);
                return;
            }

            // 1. Load Local Stats (First Pass for immediate responsiveness)
            let currentStats = await dbAdapter.get<StudentStats & { id: string }>('stats', user.uid);
            if (currentStats) {
                console.log(`[Progression] Local profile found for ${user.uid}:`, {
                    layout: currentStats.preferredLayout,
                    grade: currentStats.grade
                });
            }

            // 2. Load Cloud Stats (Second Pass for actual truth/sync)
            try {
                const cloudRef = doc(db, 'students', user.uid);
                const cloudSnap = await getDoc(cloudRef);

                if (cloudSnap.exists()) {
                    const cloudData = cloudSnap.data() as StudentStats;
                    console.log(`[Progression] Cloud profile found for ${user.uid}:`, {
                        layout: cloudData.preferredLayout,
                        grade: cloudData.grade
                    });

                    // Merge: Cloud wins for settings/meta, local wins for some offline accumulation if needed
                    currentStats = {
                        ...currentStats, // Start with local
                        ...cloudData,    // Cloud overrides (layout, grade, etc.)
                        id: user.uid
                    };
                    await dbAdapter.put('stats', currentStats);
                } else {
                    console.log(`[Progression] No cloud profile found for ${user.uid}. Using local.`);
                }
            } catch (error) {
                console.warn("[Progression] Cloud stats fetch failed, falling back to local only", error);
            }

            if (currentStats) {
                // Ensure lastActiveDate is set to at least today if it's missing (for the guard)
                const finalStats = {
                    ...currentStats,
                    lastActiveDate: currentStats.lastActiveDate || new Date().toISOString().split('T')[0]
                };
                console.log(`[Progression] Final merged profile active:`, {
                    layout: finalStats.preferredLayout,
                    grade: finalStats.grade
                });
                setStats(finalStats);
            } else {
                // Initialize new stats for new user
                const initialStats = {
                    ...DEFAULT_STATS,
                    id: user.uid,
                    displayName: user.displayName || 'Young Shinobi',
                    lastActiveDate: new Date().toISOString().split('T')[0]
                };
                await dbAdapter.put('stats', initialStats);
                setStats(initialStats as StudentStats);
            }
            setIsLoaded(true);
        };
        loadStats();
    }, [user]);

    /**
     * Awards XP to the student and checks for level-up.
     * Persists immediately to IndexedDB (Write-Through).
     */
    const addXP = async (amount: number) => {
        if (!user) return;

        const newXP = stats.powerPoints + amount;
        const newLevel = calculateLevel(newXP);

        const updatedStats: StudentStats = {
            ...stats,
            powerPoints: newXP,
            heroLevel: newLevel,
        };

        setStats(updatedStats);
        await dbAdapter.put('stats', { ...updatedStats, id: user.uid });

        if (newLevel > stats.heroLevel) {
            console.log(`[Progression] LEVEL UP! Reached level ${newLevel}`);
            // Future Enhancement: Trigger Level Up Animation/Modal
        }
    };

    /**
     * Updates engagement streak if the student hasn't active yet today.
     */
    const updateStreak = async () => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];

        if (stats.lastActiveDate === today) return;

        // Check if it was yesterday to increment streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = stats.streakCount;
        if (stats.lastActiveDate === yesterdayStr) {
            newStreak += 1;
        } else if (stats.streakCount > 0) {
            newStreak = 1; // Reset to 1 if streak was broken
        } else {
            newStreak = 1; // First day
        }

        const updatedStats: StudentStats = {
            ...stats,
            lastActiveDate: today,
            streakCount: newStreak,
            activityLog: Array.from(new Set([...stats.activityLog, today]))
        };

        setStats(updatedStats);
        await dbAdapter.put('stats', { ...updatedStats, id: user.uid });
    };

    /**
     * Scans for newly unlocked achievements based on current mastery and stats.
     */
    const checkForAchievements = async () => {
        if (!user) return [];

        const alreadyEarnedIds = (stats.achievements || []).map(a => a.id);
        const newlyEarned = checkNewAchievements(mastery, stats, alreadyEarnedIds);

        if (newlyEarned.length > 0) {
            const updatedAchievements = [...(stats.achievements || []), ...newlyEarned];
            const updatedStats = { ...stats, achievements: updatedAchievements };

            setStats(updatedStats);
            await dbAdapter.put('stats', { ...updatedStats, id: user.uid });

            return newlyEarned;
        }

        return [];
    };

    /**
     * Updates arbitrary fields in the student stats object.
     * Useful for persisting avatars, layout preferences, etc.
     */
    const updateStats = async (updates: Partial<StudentStats>, immediate = false) => {
        if (!user) return;
        const updatedStats = { ...stats, ...updates };
        setStats(updatedStats);
        setIsDirty(true);
        await dbAdapter.put('stats', { ...updatedStats, id: user.uid });

        if (immediate) {
            await forceSyncToCloud(updatedStats);
        }
    };

    /**
     * Forces an immediate cloud synchronization of student data.
     * Can be used to sync the current user or a specific student (by admin).
     */
    const saveChangesToCloud = async (userId?: string, statsToSync?: StudentStats) => {
        const targetUid = userId || user?.uid;
        const targetStats = statsToSync || stats;

        if (!targetUid) return;
        setIsSyncing(true);

        try {
            // Fetch latest mastery from local DB for the target user
            const localMastery = await dbAdapter.get<{ id: string, map: MasteryMap }>('mastery', targetUid);

            const success = await syncService.syncToCloud(
                targetUid,
                targetStats,
                localMastery?.map
            );

            if (success) {
                setIsDirty(false);
                console.log(`[Progression] Manual Cloud Sync Successful for: ${targetUid}`);
            }
        } catch (err) {
            console.error(`[Progression] Manual Sync Failed for ${targetUid}:`, err);
            throw err; // Re-throw to allow component-level error handling
        } finally {
            setIsSyncing(false);
        }
    };

    /**
     * FORCE SYNC TO CLOUD
     * Bypasses the auto-sync debounce for high-priority administrative changes.
     */
    const forceSyncToCloud = async (statsOverride?: StudentStats) => {
        if (!user) return;
        await saveChangesToCloud(user.uid, statsOverride || stats);
    };

    return (
        <ProgressionContext.Provider value={{
            stats,
            addXP,
            updateStreak,
            checkForAchievements,
            updateStats,
            updateProfileDetails: updateStats,
            saveChangesToCloud,
            forceSyncToCloud,
            isDirty,
            setIsDirty,
            isLoaded,
            isSyncing
        }}>
            {children}
        </ProgressionContext.Provider>
    );
}

export const useProgression = () => {
    const context = useContext(ProgressionContext);
    if (!context) throw new Error('useProgression must be used within ProgressionProvider');
    return context;
};
