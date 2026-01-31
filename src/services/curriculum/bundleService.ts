import { getDoc } from 'firebase/firestore';
import { getBundleMasterDoc, getBundleDoc } from '@services/db/firestore';
import { dbAdapter } from '@core/database/adapter';
import { BundleMaster } from '@/types/bundleMaster';
import { SubjectBundle } from '@/types/bundles';

/**
 * OPTIMIZED BUNDLE SERVICE
 * Implements the "Check-Master-First" pattern to minimize Firestore reads.
 */

export const bundleService = {
    /**
     * Retrieves a subject bundle, using local cache if valid, 
     * or fetching from network if the Master Index indicates an update.
     */
    async getSubjectBundle(bundleId: string): Promise<SubjectBundle | null> {
        try {
            // Step 1: Check Local Cache (IndexedDB)
            const localBundle = await dbAdapter.get<SubjectBundle>('subjects', bundleId);

            // Step 2: Check Master Index (Firestore - Small Read)
            const masterRef = getBundleMasterDoc(bundleId);
            const masterSnap = await getDoc(masterRef);

            if (!masterSnap.exists()) {
                console.warn(`[BundleService] Bundle Master not found for: ${bundleId}`);
                // Fallback: If we have local, use it
                return localBundle || null;
            }

            const masterData = masterSnap.data() as BundleMaster;

            // Step 3: Compare Versions
            // If local exists and timestamps match, we have a "Zero-Cost" hit
            if (localBundle && localBundle.lastUpdated === masterData.lastUpdateDate) {
                console.log(`[BundleService] Optimization Hit: Local cache valid for ${bundleId}.`);
                return localBundle;
            }

            // Step 4: Fetch & Sync (Large Read)
            console.log(`[BundleService] Cache stale or missing. Fetching full bundle: ${bundleId}`);
            const bundleRef = getBundleDoc(bundleId);
            const bundleSnap = await getDoc(bundleRef);

            if (!bundleSnap.exists()) {
                throw new Error(`Subject Bundle Content not found for ${bundleId}`);
            }

            const freshBundle = bundleSnap.data() as SubjectBundle;

            // Inject/Verification of timestamp to ensure next check passes
            freshBundle.lastUpdated = masterData.lastUpdateDate;

            // Sync 1: Save the Bundled Subject to IDB
            await dbAdapter.put('subjects', freshBundle);

            // Sync 2: Burst the Question Bank into the Questions Store for fast lookup
            // This allows the Bayesian Engine to query questions individually
            if (freshBundle.questions && freshBundle.questions.length > 0) {
                const questionStorePromises = freshBundle.questions.map(q =>
                    dbAdapter.put('questions', q)
                );
                await Promise.all(questionStorePromises);
                console.log(`[BundleService] Burst-synced ${freshBundle.questions.length} questions to IDB.`);
            }

            return freshBundle;

        } catch (error) {
            console.error("[BundleService] Failed to load bundle:", error);
            // Offline Fallback
            if (error instanceof Error && error.message.includes('offline')) {
                const offlineBundle = await dbAdapter.get<SubjectBundle>('subjects', bundleId);
                return offlineBundle || null;
            }
            return null;
        }
    }
};
