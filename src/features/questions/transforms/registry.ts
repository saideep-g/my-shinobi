import { QuestionTransformer } from './types';

/**
 * LENS REGISTRY
 * Stores the logic for upgrading question data between versions.
 */

class LensRegistry {
    private transformers: Map<string, QuestionTransformer> = new Map();

    /**
     * Registers a lens that knows how to move data from one version to another.
     * Key format: {templateId}:{fromVersion}->{toVersion}
     */
    register(transformer: QuestionTransformer) {
        const key = `${transformer.templateId}:${transformer.fromVersion}->${transformer.toVersion}`;
        this.transformers.set(key, transformer);
        console.log(`[LensEngine] Registered Lens: ${key}`);
    }

    /**
     * Retrieves a transformer for a specific migration path.
     */
    get(templateId: string, from: number, to: number): QuestionTransformer | undefined {
        return this.transformers.get(`${templateId}:${from}->${to}`);
    }
}

export const lensRegistry = new LensRegistry();
