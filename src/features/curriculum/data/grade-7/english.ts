// src/features/curriculum/data/grade-7/english.ts
import { Subject } from '@/types/curriculum';

export const EnglishGrade7: Subject = {
    id: 'eng-7',
    name: 'English',
    grade: 7,
    chapters: [
        {
            id: 'tenses-01',
            title: 'Mastering Tenses',
            order: 1,
            atoms: [
                {
                    id: 'present-simple-01',
                    title: 'Present Simple: Structure',
                    type: 'conceptual',
                    prerequisites: [],
                    status: 'LIVE'
                },
                {
                    id: 'present-cont-01',
                    title: 'Present Continuous: Usage',
                    type: 'procedural',
                    prerequisites: ['present-simple-01'],
                    status: 'DRAFT' // You can work on this while others stay LIVE
                }
            ]
        }
    ]
};