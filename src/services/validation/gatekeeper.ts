import { hashingService } from './hashing';
import { dbAdapter } from '@core/database/adapter';

/**
 * DUPLICATE GATEKEEPER
 * The primary defense against redundant AI-generated content.
 */

export interface ValidationResult {
    isDuplicate: boolean;
    existingId?: string;
    newHash: string;
}

export const gatekeeperService = {
    /**
     * Validates a new question against the existing local library.
     * * In Phase 4, we added a 'by-hash' index to IndexedDB which 
     * allows this check to be near-instant.
     */
    async validateNewQuestion(rawQuestion: any): Promise<ValidationResult> {
        const hash = hashingService.generateQuestionHash({
            text: rawQuestion.text,
            correctAnswer: rawQuestion.answer,
            atomId: rawQuestion.atomId,
            options: rawQuestion.options
        });

        // Check IndexedDB 'questions' store via the 'by-hash' index
        const existing = await dbAdapter.getQuestionByHash(hash);

        if (existing) {
            return {
                isDuplicate: true,
                existingId: existing.id,
                newHash: hash
            };
        }

        return {
            isDuplicate: false,
            newHash: hash
        };
    }
};
