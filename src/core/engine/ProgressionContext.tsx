import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { useAuth } from '@core/auth/AuthContext';
import { calculateLevel } from './progression';
import { StudentStats, Achievement } from '@/types/progression';
import { useIntelligence } from './IntelligenceContext';
import { checkNewAchievements } from './achievements/achievementEngine';

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
    isLoaded: boolean;
}

const DEFAULT_STATS: StudentStats = {
    powerPoints: 0,
    heroLevel: 1,
    streakCount: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    activityLog: [],
    preferredLayout: 'quest' // Matches StudentStats type from progression.ts
};

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

export const ProgressionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { mastery } = useIntelligence();
    const [stats, setStats] = useState<StudentStats>(DEFAULT_STATS);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load historical stats from IndexedDB on startup/auth change
    useEffect(() => {
        const loadStats = async () => {
            if (!user) {
                setStats(DEFAULT_STATS);
                setIsLoaded(false);
                return;
            }

            const localStats = await dbAdapter.get<StudentStats & { id: string }>('stats', user.uid);
            if (localStats) {
                setStats(localStats);
            } else {
                // Initialize new stats for new user
                const initialStats = { ...DEFAULT_STATS, id: user.uid };
                await dbAdapter.put('stats', initialStats);
                setStats(DEFAULT_STATS);
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
    const updateStats = async (updates: Partial<StudentStats>) => {
        if (!user) return;
        const updatedStats = { ...stats, ...updates };
        setStats(updatedStats);
        await dbAdapter.put('stats', { ...updatedStats, id: user.uid });
    };

    return (
        <ProgressionContext.Provider value={{
            stats,
            addXP,
            updateStreak,
            checkForAchievements,
            updateStats,
            updateProfileDetails: updateStats,
            isLoaded
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
