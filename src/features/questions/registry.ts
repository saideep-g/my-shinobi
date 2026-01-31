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
