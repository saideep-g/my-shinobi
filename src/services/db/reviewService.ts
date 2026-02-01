import { db } from '@core/database/firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    deleteField,
    query,
    where,
    getDoc
} from 'firebase/firestore';
import { ReviewItem } from '@/types/admin';
import { QuestionBase } from '@/types/questions';

/**
 * REVIEW SERVICE
 * Handles interactions with the Firestore review_queue.
 */
export const reviewService = {
    /**
     * Flags a question and adds it to the review queue.
     */
    async flagQuestion(bundleId: string, question: QuestionBase, reason: string): Promise<void> {
        const reviewCol = collection(db, 'review_queue');
        await addDoc(reviewCol, {
            bundleId,
            question,
            reason,
            status: 'PENDING',
            flaggedAt: Date.now()
        });
    },

    /**
     * Fetches all pending items from the review queue.
     */
    async getReviewItems(): Promise<ReviewItem[]> {
        const reviewCol = collection(db, 'review_queue');
        const q = query(reviewCol, where('status', '==', 'PENDING'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
        } as ReviewItem));
    },

    /**
     * Resolves an item in the queue.
     * If action is 'DELETE', it also removes the question from the bundle document.
     */
    async resolveReviewItem(id: string, action: 'KEEP' | 'DELETE' | 'EDITED'): Promise<void> {
        const itemRef = doc(db, 'review_queue', id);
        const itemSnap = await getDoc(itemRef);

        if (!itemSnap.exists()) return;
        const item = itemSnap.data() as ReviewItem;

        if (action === 'DELETE') {
            // 1. Remove from the bundle document
            // Instructions say: use deleteField() on the question_bundle_data collection (wait, collection name or field?)
            // Usually bundles are in 'bundles' collection and question data is a map.
            const bundleRef = doc(db, 'bundles', item.bundleId);
            await updateDoc(bundleRef, {
                [`questions.${item.question.id}`]: deleteField()
            });
        }

        // 2. Mark as RESOLVED in the queue
        await updateDoc(itemRef, { status: 'RESOLVED' });
    }
};
