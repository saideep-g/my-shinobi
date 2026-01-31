/**
 * CURRICULUM DOMAIN SCHEMAS
 * Defines the hierarchical structure of knowledge in My-Shinobi.
 * Supports a Directed Acyclic Graph (DAG) for prerequisite-based learning.
 */

export type AtomType = 'conceptual' | 'procedural' | 'transfer';
export type ContentStatus = 'DRAFT' | 'VALIDATING' | 'LIVE' | 'ARCHIVED';

export interface Atom {
    /** Unique identifier (e.g., 'eng-7-tense-pres-simple-01') */
    id: string;
    title: string;
    description?: string;
    type: AtomType;
    /** IDs of atoms that MUST be mastered before this one */
    prerequisites: string[];
    /** Current lifecycle state - determines visibility in student app */
    status: ContentStatus;
    /** Links to specific question templates suitable for this atom */
    recommendedTemplates?: string[];
}

export interface Chapter {
    id: string;
    title: string;
    order: number;
    atoms: Atom[];
}

export interface Subject {
    id: string;
    name: string;
    grade: number;
    chapters: Chapter[];
    /** Subject-specific theme overrides (e.g., colors, icons) */
    metadata?: Record<string, any>;
}