import { StudentStats } from '@/types/progression';
import { QuestionLog } from '@/types/assessment';

/**
 * TABLES LEDGER LOGIC
 * Ported from Blue-Ninja-v2 parity requirements.
 * Handles granular updates to the multiplication fluency heatmap and stats.
 */

export const updateTablesLedger = (
    stats: StudentStats,
    log: QuestionLog
): Partial<StudentStats> => {
    // Initialize if missing
    const config = stats.tablesConfig || {
        currentPathStage: 1,
        tableStats: {},
        factStreaks: {},
        personalBests: {}
    };

    const { atomId, isCorrect, timeTakenMs, isValidForSpeed } = log;

    // 1. Update Fact Streaks
    const currentStreak = config.factStreaks[atomId] || 0;
    config.factStreaks[atomId] = isCorrect ? currentStreak + 1 : 0;

    // 2. Update Personal Bests (Speed)
    if (isCorrect && timeTakenMs && isValidForSpeed) {
        const currentPB = config.personalBests[atomId] || 99999;
        if (timeTakenMs < currentPB) {
            config.personalBests[atomId] = timeTakenMs;
        }
    }

    // 3. Update Table-Level Stats (e.g., Table of 7)
    // Assuming atomId format is "table-7-8"
    const match = atomId.match(/table-(\d+)-/);
    if (match) {
        const tableNum = parseInt(match[1]);
        const tStats = config.tableStats[tableNum] || {
            accuracy: 0,
            avgSpeed: 0,
            attempts: 0,
            status: 'LOCKED'
        };

        const totalAttempts = tStats.attempts + 1;
        const prevCorrect = Math.round((tStats.accuracy * tStats.attempts) / 100);
        const totalCorrect = prevCorrect + (isCorrect ? 1 : 0);

        tStats.accuracy = (totalCorrect / totalAttempts) * 100;
        tStats.attempts = totalAttempts;

        if (isCorrect && timeTakenMs && isValidForSpeed) {
            // Only update speed for correct and valid answers
            const prevValidSpeedCount = tStats.avgSpeed > 0 ? tStats.attempts - 1 : 0;
            const totalSpeedMs = (tStats.avgSpeed * prevValidSpeedCount) + timeTakenMs;
            tStats.avgSpeed = totalSpeedMs / (prevValidSpeedCount + 1);
        }

        // Mastery Check for Stage Progression
        // Require at least 12 attempts (coverage of the table) and high accuracy/speed
        if (tStats.attempts >= 12 && tStats.accuracy >= 95 && (tStats.avgSpeed > 0 && tStats.avgSpeed < 3000)) {
            tStats.status = 'MASTERED';
            // Auto-advance path stage if this was the current target
            if (config.currentPathStage === tableNum) {
                config.currentPathStage = tableNum + 1;
            }
        } else if (tStats.status !== 'MASTERED') {
            tStats.status = 'PRACTICING';
        }

        config.tableStats[tableNum] = tStats;
    }

    return { tablesConfig: config };
};
