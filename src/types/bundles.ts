import { Subject } from './curriculum';
import { QuestionBase } from './questions';

/**
 * SUBJECT BUNDLE
 * The core delivery unit for My-Shinobi content.
 * Delivers the curriculum tree AND the question library in a single payload.
 */
export interface SubjectBundle {
    id: string; // e.g., 'eng-7-tenses'
    grade?: number;
    subjectId?: string;
    version: string;
    lastUpdated: number;

    // The Curriculum Structure (Chapters, Atoms)
    curriculum: Subject;

    // The Raw Question Bank associated with this subject
    questions: QuestionBase[];

    stats?: {
        totalAtoms: number;
        totalQuestions: number;
        supportedTemplates: string[];
    };
}
