import { Chapter } from '@/types/curriculum';

/**
 * ENGLISH TENSES CHAPTER
 * Defined for Grade 7. This setup ensures that the 'Intelligence Radar'
 * knows exactly which atoms exist and what the student needs to learn next.
 */

export const EnglishTensesChapter: Chapter = {
    id: 'eng-7-ch1-tenses',
    title: 'Mastering the Tense System',
    order: 1,
    atoms: [
        {
            id: 'eng-7-pres-simple-01',
            title: 'Present Simple: General Truths',
            type: 'conceptual',
            prerequisites: [],
            status: 'LIVE',
            recommendedTemplates: ['mcq-v1', 'two-tier-v1']
        },
        {
            id: 'eng-7-pres-cont-01',
            title: 'Present Continuous: Actions Now',
            type: 'procedural',
            prerequisites: ['eng-7-pres-simple-01'], // Requires mastering simple tense first
            status: 'LIVE',
            recommendedTemplates: ['mcq-v1', 'sorting-v1']
        },
        {
            id: 'eng-7-past-simple-01',
            title: 'Past Simple: Completed Actions',
            type: 'conceptual',
            prerequisites: ['eng-7-pres-simple-01'],
            status: 'DRAFT' // Still being worked on by the content team
        }
    ]
};
