import { QuestionBase } from '@/types/questions';

/**
 * QUALITY GUARD SERVICE
 * Automates the detection of bias and integrity issues in the curriculum.
 */
export const qualityGuard = {
    /**
     * Detects if the correct answer is significantly longer than the longest distractor.
     * Rule: Flag if the correct answer is > 20% longer than the longest distractor.
     */
    detectLengthBias(question: QuestionBase): boolean {
        if (question.templateId !== 'mcq') return false;

        const data = question.data as any;
        if (!data.options || !data.answer) return false;

        const answer = data.answer;
        const distractors = data.options.filter((o: string) => o.trim().toLowerCase() !== answer.trim().toLowerCase());

        if (distractors.length === 0) return false;

        const correctLen = answer.length;
        const maxDistractorLen = Math.max(...distractors.map((d: string) => d.length));

        // Ignore single-word answers as per instructions (let's assume length < 3 or similar, 
        // but instruction just says "Ignore single-word answers"). 
        // Actually, if it's a single word, maxDistractorLen might be small.
        // Let's check for spaces to determine "single word".
        if (!answer.includes(' ')) return false;

        const isBiased = (correctLen - maxDistractorLen) / maxDistractorLen > 0.2;
        return isBiased;
    },

    /**
     * Ensures the answer string exactly matches one of the entries in the options array.
     * Rule: case-insensitive, trimmed.
     */
    validateIntegrity(question: QuestionBase): { isValid: boolean; error?: string } {
        if (question.templateId !== 'mcq') return { isValid: true };

        const data = question.data as any;
        const options = data.options || [];
        const answer = data.answer || '';

        const isValid = options.some((opt: string) => opt.trim().toLowerCase() === answer.trim().toLowerCase());

        if (!isValid) {
            return { isValid: false, error: `Answer "${answer}" does not match any entries in the options array.` };
        }

        return { isValid: true };
    },

    /**
     * Returns a summary of bias and integrity issues found in a bundle.
     */
    getQuestionHealth(questions: QuestionBase[]) {
        const issues = questions.map(q => ({
            id: q.id,
            hasBias: this.detectLengthBias(q),
            integrity: this.validateIntegrity(q)
        }));

        const biasedCount = issues.filter(i => i.hasBias).length;
        const integrityErrors = issues.filter(i => !i.integrity.isValid).length;

        return {
            total: questions.length,
            biasedCount,
            integrityErrors,
            isHealthy: biasedCount === 0 && integrityErrors === 0,
            details: issues
        };
    }
};
