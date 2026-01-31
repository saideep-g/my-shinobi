import { QuestionBase } from '@/types/questions';

/**
 * MULTIPLICATION TABLE GENERATOR
 * Generates dynamic QuestionBase objects for the Math Table subject.
 * These are not stored in the static bundle but created on-the-fly.
 */

export const generateMathTableQuestion = (atomId: string): QuestionBase => {
    // 1. Identify Target Table from Atom ID (e.g., 'table-7')
    const tableNum = parseInt(atomId.split('-').pop() || '1');

    // 2. Select a random multiplier (1 - 12)
    const multiplier = Math.floor(Math.random() * 12) + 1;
    const answer = tableNum * multiplier;

    // 3. Generate a stable but unique ID for this instance
    const questionId = `dyn-${atomId}-${multiplier}-${Date.now()}`;

    // 4. Construct the standard QuestionBase payload
    return {
        id: questionId,
        atomId: atomId,
        templateId: 'math-table',
        version: 1,
        difficulty: 'EASY',
        contentHash: `hash-${tableNum}x${multiplier}`, // Stable hash for similar problems
        data: {
            type: 'fact', // Single fact interaction
            table: tableNum,
            multiplier: multiplier,
            correctAnswer: answer.toString(),
            subject: 'Mathematics'
        },
        tags: ['multiplication', 'dynamic']
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
