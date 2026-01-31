import { Subject } from './curriculum';
import { QuestionBase } from './questions';

/**
 * SUBJECT BUNDLE
 * The core delivery unit for My-Shinobi content.
 * Delivers the curriculum tree AND the question library in a single payload.
 */
export interface SubjectBundle {
    id: string; // e.g., 'eng-7-tenses'
    version: string; // e.g., '1.0.0'
    lastUpdated: number; // Timestamp matching Master entry

    // The Curriculum Structure (Chapters, Atoms)
    subject: Subject;

    // The Raw Question Bank associated with this subject
    questions: QuestionBase[];
}
