/**
 * PROGRESSION ENGINE
 * Handles the logic for XP calculation and Level-Up thresholds.
 * 
 * Mastery progression follows a square-root curve:
 * Level 1: 0 - 99 XP
 * Level 2: 100 - 399 XP
 * Level 3: 400 - 899 XP
 * Level 4: 900+ XP
 * 
 * Formula: Level = floor(sqrt(XP / 100)) + 1
 */

export const PROGRESSION_CONSTANTS = {
    XP_PER_CORRECT: 10,
    XP_PER_ATTEMPT: 2,
    XP_PER_MASTERY_MILESTONE: 50, // Bonus for hitting 85% mastery on an atom
    BASE_XP_FOR_LEVEL: 100,
};

/**
 * Calculates current Hero Level based on total XP.
 */
export const calculateLevel = (totalXP: number): number => {
    if (totalXP <= 0) return 1;
    return Math.floor(Math.sqrt(totalXP / PROGRESSION_CONSTANTS.BASE_XP_FOR_LEVEL)) + 1;
};

/**
 * Calculates the total XP required to REACH a specific level.
 */
export const getXPForLevel = (level: number): number => {
    if (level <= 1) return 0;
    return Math.pow(level - 1, 2) * PROGRESSION_CONSTANTS.BASE_XP_FOR_LEVEL;
};

/**
 * Calculates the total XP required to reach the NEXT level.
 */
export const getXPForNextLevel = (currentLevel: number): number => {
    return Math.pow(currentLevel, 2) * PROGRESSION_CONSTANTS.BASE_XP_FOR_LEVEL;
};

/**
 * Returns the percentage of progress within the current level.
 * Used for filling XP progress bars in the UI.
 */
export const getProgressToNextLevel = (totalXP: number): number => {
    const currentLevel = calculateLevel(totalXP);
    const currentLevelStartXP = getXPForLevel(currentLevel);
    const nextLevelStartXP = getXPForNextLevel(currentLevel);

    const xpInCurrentLevel = totalXP - currentLevelStartXP;
    const xpNeededForLevel = nextLevelStartXP - currentLevelStartXP;

    if (xpNeededForLevel === 0) return 0;
    return Math.min((xpInCurrentLevel / xpNeededForLevel) * 100, 100);
};
