import { SubjectBundle } from '@/types/bundles';
import { MasteryMap } from '@/types/progression';
import { QuestionBase } from '@/types/questions';

import { generateMathTableQuestion } from '@/features/curriculum/services/tableGenerator';

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
    recentQuestionIds: string[] = [], // Prevent immediate repeats
    activeChapterIds?: string[] // School-Sync Guard
): QuestionBase | null => {

    // 1. Filter Atoms by School-Sync and Prerequisites
    const unlockedAtoms = bundle.curriculum.chapters
        .filter(ch => {
            // If activeChapterIds is provided, only allow chapters in that list
            if (activeChapterIds && activeChapterIds.length > 0) {
                return activeChapterIds.includes(ch.id);
            }
            return true;
        })
        .flatMap(ch => ch.atoms)
        .filter(atom => {
            if (atom.status !== 'LIVE') return false;
            if (!atom.prerequisites || atom.prerequisites.length === 0) return true;
            return atom.prerequisites.every(preId => (masteryMap[preId] || 0) > 0.85);
        });

    if (unlockedAtoms.length === 0) {
        console.warn("[SelectionEngine] No unlocked LIVE atoms found.");
        return null;
    }

    // 2. Identify the "Priority Atom" (Lowest Mastery)
    const priorityAtom = unlockedAtoms.reduce((prev, curr) => {
        const prevMastery = masteryMap[prev.id] || 0;
        const currMastery = masteryMap[curr.id] || 0;
        return currMastery < prevMastery ? curr : prev;
    });

    // 3. Dynamic Generation Hook (Sprint 6: 70/30 Rule)
    if (bundle.isDynamic) {
        // 70% chance to pick the lowest-mastery unlocked atom (Current Path)
        // 30% chance to pick any other mastered atom (Review facts)
        const isReview = Math.random() < 0.3;
        const masteredAtoms = bundle.curriculum.chapters
            .flatMap(ch => ch.atoms)
            .filter(a => (masteryMap[a.id] || 0) >= 0.85);

        let targetAtom = priorityAtom;
        if (isReview && masteredAtoms.length > 0) {
            targetAtom = masteredAtoms[Math.floor(Math.random() * masteredAtoms.length)];
            console.log(`[SelectionEngine] Review Loop: Targetting mastered atom: ${targetAtom.id}`);
        } else {
            console.log(`[SelectionEngine] Current Path: Targetting weakest atom: ${targetAtom.id}`);
        }

        const masteryVal = masteryMap[targetAtom.id] || 0;
        return generateMathTableQuestion(targetAtom.id, masteryVal);
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
