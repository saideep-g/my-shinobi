import { writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@core/database/firebase';
import { dbAdapter } from '@core/database/adapter';
import { getStudentDoc } from '@services/db/firestore';
import { StudentStats, MasteryMap } from '@/types/progression';

/**
 * CLOUD SYNC SERVICE
 * Bridges the gap between local IndexedDB and Cloud Firestore.
 * * Uses Atomic Batches to ensure that either everything syncs or nothing does.
 * * Follows the "Last-Write-Wins" pattern for student stats.
 */

export const syncService = {
    /**
     * Performs a full synchronization of the student's progress.
     * Syncs: Stats, Mastery Map, and individual Session logs.
     */
    async syncToCloud(userId: string): Promise<boolean> {
        const batch = writeBatch(db);

        try {
            // 1. Sync Student Stats (Level, Power Points, Streaks)
            const stats = await dbAdapter.get<StudentStats & { id: string }>('stats', userId);
            if (stats) {
                const statsRef = getStudentDoc(userId);
                batch.set(statsRef, { ...stats, lastSyncedAt: serverTimestamp() }, { merge: true });
            }

            // 2. Sync Mastery Map (Bayesian Probabilities)
            const mastery = await dbAdapter.get<{ id: string, map: MasteryMap }>('mastery', userId);
            if (mastery) {
                const masteryRef = doc(db, 'students', userId, 'intelligence', 'mastery');
                batch.set(masteryRef, { map: mastery.map, lastSyncedAt: serverTimestamp() });
            }

            // 3. Sync Completed Sessions (Logs)
            // We only fetch sessions that are COMPLETED but not yet SYNCED
            const unsyncedSessions = await dbAdapter.getUnsyncedSessions();
            for (const session of unsyncedSessions) {
                // Individual session document in the student's sub-collection
                const sessionRef = doc(db, 'students', userId, 'sessions', session.id);
                batch.set(sessionRef, { ...session, status: 'SYNCED', syncedAt: serverTimestamp() });
            }

            // 4. Atomic Commit: Firestore either accepts all or rejects all
            await batch.commit();

            // 5. Update local status so we don't sync the same sessions again on next pass
            for (const session of unsyncedSessions) {
                await dbAdapter.put('sessions', { ...session, status: 'SYNCED' });
            }

            console.log(`[SyncService] Successfully synced ${unsyncedSessions.length} sessions and progress for user: ${userId}`);
            return true;
        } catch (error) {
            console.error("[SyncService] Sync failed:", error);
            return false;
        }
    }
};
