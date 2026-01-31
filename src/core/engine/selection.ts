import { SubjectBundle } from '@/types/bundles';
import { MasteryMap } from '@/types/progression';
import { QuestionBase } from '@/types/questions';

/**
 * SELECTION ENGINE
 * The core logic for choosing the next "Optimal Question."
 * 
 * Priority Logic:
 * 1. Prerequisite Check: Only allow atoms whose prerequisites are mastered (> 0.85).
 * 2. Weak Point Target: Target the unlocked atom with the lowest mastery.
 * 3. Diversity: Prevent immediate repeats of the same question.
 */

export const selectNextQuestion = (
    bundle: SubjectBundle,
    masteryMap: MasteryMap,
    recentQuestionIds: string[] = [] // Prevent immediate repeats
): QuestionBase | null => {

    // 1. Filter Atoms by Prerequisites and Status
    // An atom is "Unlocked" if all its prerequisites have mastery > 0.85
    const unlockedAtoms = bundle.curriculum.chapters
        .flatMap(ch => ch.atoms)
        .filter(atom => {
            if (atom.status !== 'LIVE') return false;
            // If no prerequisites, it's unlocked by default
            if (!atom.prerequisites || atom.prerequisites.length === 0) return true;
            // Otherwise, check if all prerequisites meet the mastery threshold
            return atom.prerequisites.every(preId => (masteryMap[preId] || 0) > 0.85);
        });

    if (unlockedAtoms.length === 0) {
        console.warn("[SelectionEngine] No unlocked LIVE atoms found.");
        return null;
    }

    // 2. Identify the "Priority Atom"
    // We look for the unlocked atom with the lowest mastery probability
    const priorityAtom = unlockedAtoms.reduce((prev, curr) => {
        const prevMastery = masteryMap[prev.id] || 0;
        const currMastery = masteryMap[curr.id] || 0;
        return currMastery < prevMastery ? curr : prev;
    });

    // 3. Filter Questions for that Atom
    const availableQuestions = bundle.questions.filter(q =>
        q.atomId === priorityAtom.id &&
        !recentQuestionIds.includes(q.id)
    );

    if (availableQuestions.length === 0) {
        // Fallback: If no questions for the priority atom (maybe they've all been seen recently), 
        // pick from any unlocked atom pool
        const fallbackQuestions = bundle.questions.filter(q =>
            unlockedAtoms.some(a => a.id === q.atomId) &&
            !recentQuestionIds.includes(q.id)
        );

        if (fallbackQuestions.length === 0) return null;
        return fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    }

    // 4. Final Selection (Randomized within the priority pool)
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
};
