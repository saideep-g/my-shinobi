import { QuestionBase } from '@/types/questions';

/**
 * MULTIPLICATION TABLE GENERATOR
 * Generates dynamic QuestionBase objects for the Math Table subject.
 */

export const generateMathTableQuestion = (atomId: string, masteryVal: number = 0): QuestionBase => {
    // 1. Identify Target Table from Atom ID (e.g., 'table-7')
    const tableNum = parseInt(atomId.split('-').pop() || '1');

    // 2. Select a random multiplier (1 - 12)
    const multiplier = Math.floor(Math.random() * 12) + 1;
    const answer = tableNum * multiplier;

    // 3. Determine Interaction Type (Fact vs Missing Multiplier)
    // If mastery is high (> 0.8), introduce missing multipliers with 40% probability
    const isMissingMultiplier = masteryVal > 0.8 && Math.random() > 0.6;
    const type = isMissingMultiplier ? 'missing-multiplier' : 'fact';

    // 4. Generate a stable but unique ID for this instance
    const questionId = `dyn-${atomId}-${multiplier}-${Date.now()}`;

    // 5. Construct the standard QuestionBase payload
    return {
        id: questionId,
        atomId: atomId,
        templateId: 'math-table',
        version: 1,
        difficulty: isMissingMultiplier ? 'MEDIUM' : 'EASY',
        contentHash: `hash-${tableNum}x${multiplier}-${type}`, // Stable hash for similar problems
        data: {
            type: type,
            table: tableNum,
            multiplier: multiplier,
            correctAnswer: isMissingMultiplier ? multiplier.toString() : answer.toString(),
            subject: 'Mathematics'
        },
        tags: ['multiplication', 'dynamic', type]
    };
};

/**
 * Generates a "Complete the Table" question (Advanced Interaction)
 */
export const generateFullTableQuestion = (atomId: string): QuestionBase => {
    const tableNum = parseInt(atomId.split('-').pop() || '1');

    return {
        id: `dyn-full-${atomId}-${Date.now()}`,
        atomId: atomId,
        templateId: 'math-table',
        version: 1,
        difficulty: 'MEDIUM',
        contentHash: `hash-full-${tableNum}`,
        data: {
            type: 'grid', // Full table interaction
            table: tableNum,
            range: [1, 10],
            subject: 'Mathematics'
        },
        tags: ['multiplication', 'grid']
    };
};
