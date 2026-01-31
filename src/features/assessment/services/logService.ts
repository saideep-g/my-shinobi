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
        masteryAfter: number
    ): QuestionLog {
        return {
            questionId: question.id,
            isCorrect,
            duration,
            timestamp: Date.now(),
            masteryBefore,
            masteryAfter,
            atomId: question.atomId,
            // Metadata can be stored in the question log for deeper analysis later
            // Such as identifying common misconceptions based on the atom
        };
    }
};
