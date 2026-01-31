/**
 * DATA MIGRATION UTILITY
 * Maps legacy "Blue Ninja" progress to the new Bayesian Mastery Map.
 * 
 * This script ensures that years of training progress are preserved
 * when switching to the new Bayesian Engine.
 */

export const migrateStudentData = async (legacyData: any) => {
    console.log("Starting Migration: Blue Ninja -> My-Shinobi...");

    // 1. Map old "Points" to new "PowerPoints"
    const powerPoints = legacyData.totalScore || 0;

    // 2. Map "Lessons Completed" to "Mastery Probability"
    // We treat completed lessons as 85% mastery (The 'Mastered' threshold)
    const masteryMap: Record<string, number> = {};
    if (legacyData.completedAtoms) {
        legacyData.completedAtoms.forEach((atomId: string) => {
            masteryMap[atomId] = 0.85;
        });
    }

    // 3. Prepare for persistence (Firestore/IndexedDB)
    const migratedStats = {
        powerPoints,
        heroLevel: Math.floor(Math.sqrt(powerPoints / 100)) + 1,
        mastery: masteryMap,
        migratedAt: Date.now()
    };

    console.log("Migration successful. Resulting profile:", migratedStats);
    return migratedStats;
};
