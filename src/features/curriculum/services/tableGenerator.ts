import { QuestionBase } from '@/types/questions';

/**
 * MATH TABLE GENERATOR
 * Dynamically constructs multiplication fact questions on-the-fly.
 * Ported from Blue-Ninja-v2 parity requirements.
 */

export const generateMathTableQuestion = (
    atomId: string,
    masteryVal: number,
    streak: number = 0
): QuestionBase => {
    // atomId format is guaranteed by curriculum as "table-{t}-{m}"
    const parts = atomId.split('-');
    const table = parseInt(parts[1]) || 2;
    const multiplier = parseInt(parts[2]) || 1;
    const product = table * multiplier;

    // RULE: Missing Multipliers only for high-streak facts
    const isMissingMultiplier = streak >= 5 && Math.random() < 0.4;

    return {
        id: `dyn-table-${atomId}-${Math.random().toString(36).substring(7)}`,
        contentHash: `hash-${table}-${multiplier}-${isMissingMultiplier}`,
        atomId,
        difficulty: masteryVal > 0.8 ? 'HARD' : 'MEDIUM',
        templateId: 'math-table',
        version: 1,
        tags: ['math', 'multiplication', `table-${table}`],
        data: {
            type: isMissingMultiplier ? 'missing-multiplier' : 'fact',
            questionType: isMissingMultiplier ? 'MISSING_MULTIPLIER' : 'DIRECT',
            table,
            multiplier,
            correctAnswer: isMissingMultiplier ? multiplier.toString() : product.toString(),
            subject: 'Multiplication Tables'
        }
    };
};
