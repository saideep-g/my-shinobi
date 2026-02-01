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
    async syncToCloud(userId: string, providedStats?: StudentStats, providedMastery?: MasteryMap): Promise<boolean> {
        const batch = writeBatch(db);

        try {
            // 1. Sync Student Stats (Level, Power Points, Streaks)
            const stats = providedStats || await dbAdapter.get<StudentStats & { id: string }>('stats', userId);
            if (stats) {
                const cleanStats = JSON.parse(JSON.stringify(stats));
                const statsRef = getStudentDoc(userId);
                batch.set(statsRef, { ...cleanStats, lastSynced: serverTimestamp() }, { merge: true });
            }

            // 2. Sync Mastery Map (Bayesian Probabilities)
            const mastery = providedMastery
                ? { id: userId, map: providedMastery }
                : await dbAdapter.get<{ id: string, map: MasteryMap }>('mastery', userId);

            if (mastery) {
                const masteryRef = doc(db, 'students', userId, 'intelligence', 'mastery');
                batch.set(masteryRef, { map: mastery.map, lastSyncedAt: serverTimestamp() });
            }

            // 3. Sync Completed Sessions (Logs)
            const unsyncedSessions = await dbAdapter.getUnsyncedSessions(userId);
            for (const session of unsyncedSessions) {
                // Remove undefined fields to prevent Firestore "Unsupported field value: undefined" errors
                const cleanSession = JSON.parse(JSON.stringify(session));

                const sessionRef = doc(db, 'students', userId, 'sessions', session.id);
                batch.set(sessionRef, { ...cleanSession, status: 'SYNCED', syncedAt: serverTimestamp() });
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
    },

    /**
     * Retrieves all historical sessions for a specific student from Firestore.
     */
    async fetchAllSessions(userId: string): Promise<any[]> {
        const { getDocs, collection, query, orderBy } = await import('firebase/firestore');
        const sessionRef = collection(db, 'students', userId, 'sessions');
        const q = query(sessionRef, orderBy('startTime', 'desc'));

        const snap = await getDocs(q);
        return snap.docs.map(d => ({ ...d.data(), id: d.id }));
    }
};
