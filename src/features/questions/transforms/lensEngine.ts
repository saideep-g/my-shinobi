import { lensRegistry } from './registry';
import { QuestionBase } from '@/types/questions';

/**
 * LENS ENGINE
 * The processor that ensures question data matches the expected component version.
 * * This prevents UI crashes caused by missing fields in legacy data.
 * * Supports multi-step migrations (e.g., v1 to v3).
 */

export const lensEngine = {
    /**
     * Applies the necessary transformations to a question's data.
     * @param question The question metadata (containing templateId and version)
     * @param data The raw data from the database (e.g., Firestore/IDB)
     * @param targetVersion The version the current UI component expects
     */
    applyLens(question: QuestionBase, data: any, targetVersion: number): any {
        let currentData = { ...data };
        let currentVersion = question.version;

        // Keep applying lenses until we reach the target version
        while (currentVersion < targetVersion) {
            const transformer = lensRegistry.get(question.templateId, currentVersion, currentVersion + 1);

            if (!transformer) {
                console.warn(`[LensEngine] Missing transformation path: ${question.templateId} v${currentVersion} -> v${currentVersion + 1}`);
                break; // Stop if no path is found to avoid infinite loops
            }

            console.log(`[LensEngine] Applying Lens: ${question.templateId} v${currentVersion} -> v${currentVersion + 1}`);

            currentData = transformer.transform(currentData, {
                questionId: question.id,
                atomId: question.atomId
            });

            currentVersion++;
        }

        return currentData;
    }
};
