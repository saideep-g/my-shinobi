import { QuestionManifest } from '@/types/questions';

/**
 * VERSIONED TEMPLATE REGISTRY
 * Central authority for all question interaction types.
 * * Supports co-existence of multiple versions of the same template.
 * * Maps (Template ID + Version) -> Manifest (Metadata & Component).
 */

class TemplateRegistry {
    private manifests: Map<string, QuestionManifest> = new Map();

    /**
     * Registers a new question template version.
     * Example key: 'mcq-v1'
     */
    register(manifest: QuestionManifest) {
        const key = `${manifest.id}-v${manifest.version}`;
        this.manifests.set(key, manifest);
        console.log(`[Registry] Registered Template: ${key}`);
    }

    /**
     * Retrieves a manifest for a specific template and version.
     */
    get(templateId: string, version: number): QuestionManifest | undefined {
        return this.manifests.get(`${templateId}-v${version}`);
    }

    /**
     * Returns all registered templates (Useful for Admin Workbench).
     */
    getAll(): QuestionManifest[] {
        return Array.from(this.manifests.values());
    }
}

export const questionRegistry = new TemplateRegistry();

// --- BUNDLED REGISTRATION (Sprint 6) ---
questionRegistry.register({
    id: 'math-table',
    name: 'Multiplication Tables',
    version: 1,
    componentPath: 'math-table/v1/Component',
    schema: {}
});

questionRegistry.register({
    id: 'mcq',
    name: 'Multiple Choice',
    version: 1,
    componentPath: 'mcq/v1/Component',
    schema: {}
});

questionRegistry.register({
    id: 'sorting',
    name: 'Sorting',
    version: 1,
    componentPath: 'sorting/v1/Component',
    schema: {}
});
