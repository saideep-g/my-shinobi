import { QuestionBase } from '@/types/questions';

/**
 * AUTO-REPAIR & SIMILARITY SERVICE
 * Provides intelligent diagnostics for question data integrity.
 */

/**
 * Standard Levenshtein Distance Algorithm
 */
const levenshtein = (a: string, b: string): number => {
    const matrix = Array.from({ length: a.length + 1 }, () =>
        Array.from({ length: b.length + 1 }, (_, bIndex) => bIndex || 0)
    );
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
};

/**
 * Calculate similarity between 0 and 1
 */
export const getSimilarity = (s1: string, s2: string): number => {
    const len1 = s1.length;
    const len2 = s2.length;
    if (len1 === 0 && len2 === 0) return 1;
    if (len1 === 0 || len2 === 0) return 0;

    const dist = levenshtein(s1.toLowerCase(), s2.toLowerCase());
    const maxLen = Math.max(len1, len2);
    return (maxLen - dist) / maxLen;
};

export interface RepairSuggestion {
    questionId: string;
    type: 'TYPO' | 'DUPLICATE';
    originalValue?: string;
    suggestedValue?: string;
    reason: string;
}

/**
 * Suggest fixes for MCQ questions where the answer might have a typo
 * compared to the available options.
 */
export const suggestTypoFixes = (question: QuestionBase): RepairSuggestion | null => {
    if (question.templateId !== 'mcq') return null;

    const data = question.data as any;
    if (!data.options || !data.answer) return null;

    const answer = data.answer.trim();
    const options = data.options as string[];

    // If exact match found, no repair needed
    if (options.some(opt => opt.trim() === answer)) return null;

    // Find closest option
    let bestMatch = '';
    let highestSim = 0;

    for (const opt of options) {
        const sim = getSimilarity(answer, opt.trim());
        if (sim > highestSim) {
            highestSim = sim;
            bestMatch = opt.trim();
        }
    }

    // Similarity threshold > 85%
    if (highestSim >= 0.85 && highestSim < 1.0) {
        return {
            questionId: question.id,
            type: 'TYPO',
            originalValue: answer,
            suggestedValue: bestMatch,
            reason: `Highly similar to option "${bestMatch}" (${Math.round(highestSim * 100)}% match).`
        };
    }

    return null;
};

/**
 * Detect duplicate questions in a bundle based on text content fingerprints
 */
export const detectBundleDuplicates = (questions: QuestionBase[]): RepairSuggestion[] => {
    const seen = new Map<string, string>(); // Fingerprint -> QuestionID
    const duplicates: RepairSuggestion[] = [];

    questions.forEach(q => {
        // Simple fingerprint: text + sorted options (if MCQ)
        let fingerprint = ((q as any).text || (q.data as any).text || '').toLowerCase().trim();
        if (q.templateId === 'mcq' && (q.data as any).options) {
            const opts = [...(q.data as any).options].sort();
            fingerprint += '|' + opts.join(',').toLowerCase();
        }

        if (seen.has(fingerprint)) {
            duplicates.push({
                questionId: q.id,
                type: 'DUPLICATE',
                reason: `Identical content to question #${seen.get(fingerprint)?.slice(0, 8)}`
            });
        } else {
            seen.set(fingerprint, q.id);
        }
    });

    return duplicates;
};
