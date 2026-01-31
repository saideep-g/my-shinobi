/**
 * QUESTION & TEMPLATE SCHEMAS
 * Handles the "Lens" pattern for template versioning and duplicate detection.
 */

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';

export interface QuestionBase {
    /** Persistent UUID - Never changes even if content is corrected */
    id: string;
    /** SHA-256 Fingerprint of (text + answers + topic) for duplicate checking */
    contentHash: string;
    /** Link to curriculum atom */
    atomId: string;
    difficulty: QuestionDifficulty;
    /** Template ID (e.g., 'mcq-v1', 'numeric-v2') */
    templateId: string;
    version: number;
    /** Subject-specific context (e.g., 'Tenses', 'Algebra') */
    tags: string[];
}

export interface QuestionManifest {
    id: string;
    name: string;
    version: number;
    /** The actual interaction logic required for this template */
    componentPath: string;
    /** Default values for new questions of this type */
    schema: Record<string, any>;
}

/**
 * REVISION HISTORY
 * Stored within the question document to track AI-led corrections.
 */
export interface QuestionRevision {
    timestamp: number;
    previousHash: string;
    authorId: string;
    note: string;
}
