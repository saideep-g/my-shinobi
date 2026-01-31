import { lensRegistry } from '../registry';

/**
 * LENS: MCQ v1 -> v2
 * Adds the 'explanation' and 'hint' fields to legacy questions.
 */

lensRegistry.register({
    templateId: 'mcq',
    fromVersion: 1,
    toVersion: 2,
    transform: (data) => {
        return {
            ...data,
            // Provide a default empty string if the field is missing
            explanation: data.explanation || "No explanation provided for this question.",
            hint: data.hint || "",
            // We can also compute new fields based on old ones
            isHighPriority: data.difficulty === 'HARD'
        };
    }
});
