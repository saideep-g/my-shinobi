import { ACHIEVEMENTS } from './registry';
import { MasteryMap, StudentStats, Achievement } from '@/types/progression';

/**
 * ACHIEVEMENT ENGINE
 * Logic to detect newly unlocked badges based on state changes.
 * This runs in the student's browser and identifies which badges have 
 * had their criteria met during the current session.
 */

export const checkNewAchievements = (
    currentMastery: MasteryMap,
    currentStats: StudentStats,
    alreadyUnlockedIds: string[]
): Achievement[] => {
    const newUnlocks: Achievement[] = [];

    ACHIEVEMENTS.forEach((def) => {
        // 1. Skip if already earned to prevent duplicate unlocks
        if (alreadyUnlockedIds.includes(def.id)) return;

        // 2. Check if the student meets the specific criteria for this badge
        if (def.criteria(currentMastery, currentStats)) {
            newUnlocks.push({
                id: def.id,
                name: def.name,
                description: def.description,
                icon: def.icon,
                unlockedAt: Date.now(),
                // Note: The 'criteria' field in the DB-bound Achievement type 
                // is just a string description, while the registry uses a function.
                criteria: def.description
            });
        }
    });

    return newUnlocks;
};
