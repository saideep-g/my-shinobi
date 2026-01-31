import { SubjectBundle } from '@/types/bundles';

/**
 * GRADE 7 MATH MASTER BUNDLE (Skeleton)
 */

export const Grade7MathBundle: SubjectBundle = {
    id: 'grade-7-math',
    grade: 7,
    subjectId: 'math',
    version: '1.0.0',
    lastUpdated: Date.now(),
    curriculum: {
        id: 'math-7',
        name: 'Mathematics',
        grade: 7,
        chapters: [
            {
                id: 'math-7-ch1',
                title: 'Integers & Rational Numbers',
                order: 1,
                atoms: [
                    {
                        id: 'math-atom-1',
                        title: 'Integer Addition',
                        prerequisites: [],
                        type: 'conceptual',
                        status: 'LIVE'
                    },
                    {
                        id: 'math-atom-2',
                        title: 'Absolute Value',
                        prerequisites: ['math-atom-1'],
                        type: 'conceptual',
                        status: 'LIVE'
                    }
                ]
            }
        ],
        metadata: {
            theme: 'sky',
            icon: 'hash'
        }
    },
    questions: [],
    stats: {
        totalAtoms: 2,
        totalQuestions: 0,
        supportedTemplates: ['mcq-v1']
    }
};
