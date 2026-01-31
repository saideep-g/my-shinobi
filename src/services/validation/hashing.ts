import CryptoJS from 'crypto-js';

/**
 * HASHING SERVICE
 * Generates a unique "Fingerprint" for questions to prevent duplicates.
 * * It takes the core educational content (text, answers, topic) 
 * and converts it into a fixed-length SHA-256 string.
 */

export const hashingService = {
    /**
     * Generates a SHA-256 hash from a question's core content.
     * * We normalize the string (lowercase, trim) to ensure that 
     * minor whitespace differences don't create "fake" unique questions.
     */
    generateQuestionHash(data: {
        text: string;
        correctAnswer: any;
        atomId: string;
        options?: string[];
    }): string {
        // 1. Normalize and stringify the core components
        const components = [
            data.text.toLowerCase().trim(),
            data.atomId.toLowerCase().trim(),
            JSON.stringify(data.correctAnswer).toLowerCase(),
            data.options ? [...data.options].sort().join('|').toLowerCase().trim() : ''
        ];

        const payload = components.join(':::');

        // 2. Generate SHA-256 Hash
        return CryptoJS.SHA256(payload).toString();
    }
};
