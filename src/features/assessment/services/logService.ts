import { QuestionBase } from '@/types/questions';
import { QuestionLog } from '@/types/assessment';

/**
 * LOG SERVICE
 * Transforms raw interaction data into a formal QuestionLog document.
 * This is used for creating a permanent audit trail of student performance.
 */

export const logService = {
    createLog(
        question: QuestionBase,
        isCorrect: boolean,
        duration: number,
        masteryBefore: number,
        masteryAfter: number,
        timeTakenMs?: number,
        selectionRationale?: string
    ): QuestionLog {
        // Correct and within 150ms to 15s range
        const isValidForSpeed = isCorrect &&
            timeTakenMs !== undefined &&
            timeTakenMs > 150 &&
            timeTakenMs < 15000;

        return {
            questionId: question.id,
            isCorrect,
            duration,
            timeTakenMs,
            isValidForSpeed,
            questionType: (question as any).data?.questionType || 'DIRECT',
            timestamp: Date.now(),
            masteryBefore,
            masteryAfter,
            atomId: question.atomId,
            selectionRationale,
            metadata: question.data?.table ? {
                factorA: question.data.table,
                factorB: question.data.multiplier
            } : undefined
        };
    }
};
