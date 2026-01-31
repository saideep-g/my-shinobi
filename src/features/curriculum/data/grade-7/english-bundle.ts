import { SubjectBundle } from '@/types/bundles';
import { EnglishTensesChapter } from './english-tenses';
import { EnglishQuestionPool } from './english-questions';

/**
 * GRADE 7 ENGLISH MASTER BUNDLE
 * This is the high-performance document that the 'BundleMaster' 
 * references for synchronization.
 */

export const Grade7EnglishBundle: SubjectBundle = {
    id: 'grade-7-english',
    grade: 7,
    subjectId: 'english',
    version: '1.0.1',
    lastUpdated: Date.now(),
    curriculum: {
        id: 'eng-7',
        name: 'English Language',
        grade: 7,
        chapters: [EnglishTensesChapter],
        metadata: {
            theme: 'violet',
            icon: 'book-text'
        }
    },
    questions: EnglishQuestionPool,
    stats: {
        totalAtoms: EnglishTensesChapter.atoms.length,
        totalQuestions: EnglishQuestionPool.length,
        supportedTemplates: ['mcq-v1', 'sorting-v1']
    }
};
