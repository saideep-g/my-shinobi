import { QuestionLog } from '@/types/assessment';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';

/**
 * ADVANCED ANALYTICS ENGINE
 * Processes raw QuestionLog data into high-level Strategic Metrics.
 * Focused on identifying patterns in the Bayesian learning path.
 */

export interface StudentAnalytics {
    strategyMix: {
        diagnostic: number;
        remedial: number;
        mastery: number;
    };
    speedEfficiency: Record<string, number>; // Chapter Title -> Median Speed (seconds)
    struggleClusters: {
        atomId: string;
        atomTitle: string;
        accuracy: number;
        attempts: number;
    }[];
    recoveryVelocity: number; // Avg time (seconds) to correct after a mistake
}

/**
 * PROCESS STUDENT SESSION LOGS
 * Takes a flat array of all student question logs and derives metrics.
 */
export const processStudentSession = (logs: QuestionLog[]): StudentAnalytics => {
    if (!logs.length) {
        return {
            strategyMix: { diagnostic: 0, remedial: 0, mastery: 0 },
            speedEfficiency: {},
            struggleClusters: [],
            recoveryVelocity: 0
        };
    }

    // 1. Calculate Strategy Mix
    const counts = { diagnostic: 0, remedial: 0, mastery: 0 };
    logs.forEach(log => {
        const rationale = (log.selectionRationale || '').toUpperCase();
        if (rationale.includes('DIAGNOSTIC')) counts.diagnostic++;
        else if (rationale.includes('REMEDIAL') || rationale.includes('PREREQUISITE')) counts.remedial++;
        else counts.mastery++; // Default to mastery practice
    });

    const total = logs.length;
    const strategyMix = {
        diagnostic: (counts.diagnostic / total) * 100,
        remedial: (counts.remedial / total) * 100,
        mastery: (counts.mastery / total) * 100
    };

    // 2. Speed Efficiency (Median Speed per Chapter)
    const chapterSpeeds: Record<string, number[]> = {};
    const bundleMap: Record<string, string> = {}; // AtomId -> ChapterTitle

    // Build a quick lookup for Atom -> Chapter
    getAllBundles().forEach(bundle => {
        bundle.curriculum.chapters.forEach(chapter => {
            chapter.atoms.forEach(atom => {
                bundleMap[atom.id] = chapter.title;
            });
        });
    });

    logs.forEach(log => {
        if (log.isValidForSpeed === false) return;
        const chapterTitle = bundleMap[log.atomId] || 'Other';
        if (!chapterSpeeds[chapterTitle]) chapterSpeeds[chapterTitle] = [];
        chapterSpeeds[chapterTitle].push(log.duration || 0);
    });

    const speedEfficiency: Record<string, number> = {};
    Object.entries(chapterSpeeds).forEach(([chapter, speeds]) => {
        const sorted = [...speeds].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        speedEfficiency[chapter] = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    });

    // 3. Struggle Clusters (Accuracy < 50% over last 10 attempts)
    const atomStats: Record<string, { correct: number, total: number }> = {};
    // Iterate backwards to get "recent" attempts if we wanted to cap it, 
    // but here we'll just check atoms with significant volume.
    logs.forEach(log => {
        if (!atomStats[log.atomId]) atomStats[log.atomId] = { correct: 0, total: 0 };
        atomStats[log.atomId].total++;
        if (log.isCorrect) atomStats[log.atomId].correct++;
    });

    const struggleClusters = Object.entries(atomStats)
        .map(([atomId, stats]) => ({
            atomId,
            atomTitle: atomId, // In real app, lookup from curriculum
            accuracy: (stats.correct / stats.total) * 100,
            attempts: stats.total
        }))
        .filter(s => s.accuracy < 50 && s.attempts >= 5)
        .sort((a, b) => a.accuracy - b.accuracy);

    // 4. Recovery Velocity
    // Measure time spend on the 'Correct' response immediately following an 'Incorrect' response on the same atom.
    let totalRecoveryTime = 0;
    let recoveryCount = 0;

    for (let i = 1; i < logs.length; i++) {
        const current = logs[i];
        const previous = logs[i - 1];

        if (current.atomId === previous.atomId && !previous.isCorrect && current.isCorrect) {
            totalRecoveryTime += current.duration;
            recoveryCount++;
        }
    }

    const recoveryVelocity = recoveryCount > 0 ? totalRecoveryTime / recoveryCount : 0;

    return {
        strategyMix,
        speedEfficiency,
        struggleClusters,
        recoveryVelocity
    };
};
