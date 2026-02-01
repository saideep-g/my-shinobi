import { SubjectBundle } from '@/types/bundles';
import { MasteryMap, StudentStats } from '@/types/progression';
import { QuestionBase } from '@/types/questions';
import { generateMathTableQuestion } from '@/features/curriculum/services/tableGenerator';

/**
 * SELECTION ENGINE
 * The core logic for choosing the next "Optimal Question."
 */

export const selectNextQuestion = (
    bundle: SubjectBundle,
    masteryMap: MasteryMap,
    recentQuestionIds: string[] = [],
    assignedChapterIds: string[] = [],
    stats?: StudentStats
): QuestionBase | null => {

    // 1. Filter Atoms by School-Sync and Prerequisites
    const unlockedAtoms = bundle.curriculum.chapters
        // Dynamic bundles (like Tables) bypass the assigned filter to allow auto-progression
        .filter(ch => bundle.isDynamic || assignedChapterIds.includes(ch.id))
        .flatMap(ch => ch.atoms)
        .filter(atom => {
            if (atom.status !== 'LIVE') return false;
            // Standard Prerequisite logic (Bayesian Mastery Check)
            if (!atom.prerequisites || atom.prerequisites.length === 0) return true;
            return atom.prerequisites.every(preId => (masteryMap[preId] || 0) > 0.85);
        });

    if (unlockedAtoms.length === 0) return null;

    // 2. Identify the "Priority Atom" (Lowest Mastery)
    const priorityAtom = unlockedAtoms.reduce((prev, curr) => {
        const prevMastery = masteryMap[prev.id] || 0;
        const currMastery = masteryMap[curr.id] || 0;
        return currMastery < prevMastery ? curr : prev;
    });

    // 3. Dynamic Generation Hook (Blue-Ninja 70/30 Rule)
    if (bundle.isDynamic) {
        // Use provided config or a fresh default for new students
        const config = stats?.tablesConfig || {
            currentPathStage: 2,
            tableStats: {},
            factStreaks: {},
            personalBests: {}
        };
        const currentStage = config.currentPathStage;

        // Smart Injection: If current stage is very strong, start showing next stage
        const currentStageStats = config.tableStats[currentStage];
        const effectiveStage = (currentStageStats?.accuracy > 90) ? currentStage + 1 : currentStage;

        const isReview = Math.random() < 0.3;
        let targetAtomId = '';

        if (isReview) {
            // Pick a random atom from a PREVIOUSLY mastered table
            const masteredTableNums = Object.keys(config.tableStats)
                .map(Number)
                .filter(n => config.tableStats[n].status === 'MASTERED');

            const targetTable = masteredTableNums.length > 0
                ? masteredTableNums[Math.floor(Math.random() * masteredTableNums.length)]
                : currentStage;

            targetAtomId = `table-${targetTable}-${Math.floor(Math.random() * 12) + 1}`;
        } else {
            // Target the weakest atom in the current effective stage
            const stageAtoms = bundle.curriculum.chapters
                .flatMap(ch => ch.atoms)
                .filter(a => a.id.startsWith(`table-${effectiveStage}-`));

            const weakestInStage = stageAtoms.length > 0
                ? stageAtoms.reduce((prev, curr) => (masteryMap[curr.id] || 0) < (masteryMap[prev.id] || 0) ? curr : prev)
                : priorityAtom;

            targetAtomId = weakestInStage.id;
        }

        const streak = config.factStreaks[targetAtomId] || 0;
        const masteryVal = masteryMap[targetAtomId] || 0;

        return generateMathTableQuestion(targetAtomId, masteryVal, streak);
    }

    // Default Dynamic Fallback
    if (bundle.isDynamic) {
        return generateMathTableQuestion(priorityAtom.id, masteryMap[priorityAtom.id] || 0);
    }

    // 4. Static Question Selection
    const availableQuestions = bundle.questions.filter(q =>
        q.atomId === priorityAtom.id &&
        !recentQuestionIds.includes(q.id)
    );

    if (availableQuestions.length === 0) {
        const fallbackQuestions = bundle.questions.filter(q =>
            unlockedAtoms.some(a => a.id === q.atomId) &&
            !recentQuestionIds.includes(q.id)
        );

        if (fallbackQuestions.length === 0) return null;
        return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    }

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
};
