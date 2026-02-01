import { getDocs, query } from 'firebase/firestore';
import { getStudentsCol } from './firestore';
import { dbAdapter } from '@core/database/adapter';

export const userService = {
    /**
     * Fetches all student profiles from Firestore and persists them to local IndexedDB.
     * This ensures the Admin Roster is always up-to-date with newly created cloud users.
     */
    async syncRosterFromCloud(): Promise<any[]> {
        try {
            console.log("[UserService] Refreshing student roster from cloud...");
            const q = query(getStudentsCol());
            const querySnapshot = await getDocs(q);

            const remoteUsers: any[] = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();
                const userId = doc.id;

                // Construct the local record
                const userRecord = {
                    ...data,
                    id: userId
                };

                // 1. Persist to Local DB (Stats Store)
                await dbAdapter.put('stats', userRecord);

                remoteUsers.push(userRecord);
            }

            console.log(`[UserService] Successfully synced ${remoteUsers.length} students to local DB.`);
            return remoteUsers;
        } catch (error) {
            console.error("[UserService] Failed to sync roster:", error);
            throw error;
        }
    }
};
