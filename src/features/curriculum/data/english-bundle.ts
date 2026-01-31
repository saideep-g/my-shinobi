import { SubjectBundle } from '@/types/bundles';
import { QuestionBase } from '@/types/questions';
import { EnglishGrade7 } from './grade-7/english'; // Re-using our previous structure

export const EnglishTensesBundle: SubjectBundle = {
    id: 'grade-7-english',
    version: '1.0.0',
    lastUpdated: Date.now(),
    subject: EnglishGrade7,
    questions: [
        {
            id: 'q-pres-simp-001',
            atomId: 'present-simple-01',
            // Extended fields (Logic would handle these based on templateId)
            text: 'Which sentence is in the Present Simple tense?',
            type: 'MCQ',
            options: [
                { id: 'a', text: 'I am playing soccer.', isCorrect: false },
                { id: 'b', text: 'I play soccer every Sunday.', isCorrect: true },
                { id: 'c', text: 'I played soccer yesterday.', isCorrect: false },
                { id: 'd', text: 'I will play soccer.', isCorrect: false }
            ],
            // Base fields
            difficulty: 'EASY',
            version: 1,
            tags: ['grammar', 'tenses'],
            contentHash: 'hash-q-001',
            templateId: 'tpl-tense-ident'
        } as (QuestionBase & any)
    ]
};
