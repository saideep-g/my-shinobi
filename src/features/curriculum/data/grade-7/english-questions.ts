import { QuestionBase } from '@/types/questions';
import { hashingService } from '@/services/validation/hashing';

/**
 * ENGLISH QUESTION POOL (Grade 7)
 * Questions are pre-hashed to prevent duplicates during the upload process.
 */

const rawQuestions = [
    {
        id: 'q-eng-001',
        atomId: 'eng-7-pres-simple-01',
        templateId: 'mcq',
        version: 1,
        difficulty: 'EASY',
        data: {
            text: "The Sun ___ in the East.",
            options: ["rise", "rises", "rising", "rose"],
            correctAnswer: "rises",
            subject: "English"
        }
    },
    {
        id: 'q-eng-002',
        atomId: 'eng-7-pres-cont-01',
        templateId: 'sorting',
        version: 1,
        difficulty: 'MEDIUM',
        data: {
            text: "Rearrange the words to form a correct Present Continuous sentence.",
            items: ["learning", "am", "I", "English"],
            correctOrder: ["I", "am", "learning", "English"]
        }
    }
];

// Generate the Fingerprinted questions
export const EnglishQuestionPool: QuestionBase[] = rawQuestions.map(q => ({
    ...q,
    contentHash: hashingService.generateQuestionHash({
        text: q.data.text,
        correctAnswer: (q.data as any).correctAnswer || (q.data as any).correctOrder,
        atomId: q.atomId,
        options: (q.data as any).options
    }),
    tags: ['English', 'Tenses', 'Grade 7']
})) as QuestionBase[];
