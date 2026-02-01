import { QuestionBase } from './questions';

export interface ReviewItem {
    id: string;
    bundleId: string;
    question: QuestionBase;
    reason: string;
    status: 'PENDING' | 'RESOLVED';
    flaggedAt: number;
}
