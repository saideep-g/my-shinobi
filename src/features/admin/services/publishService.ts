import { runTransaction, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@core/database/firebase';
import { SubjectBundle } from '@/types/bundles';
import { bumpVersion, VersionBump } from './versioning';

/**
 * BUNDLE PUBLISHER SERVICE
 * Executes the atomic push of a subject bundle to the cloud.
 * 
 * This service is critical because it updates the large bundle and the master index
 * within a single Firestore transaction. This guarantees that clients will only
 * detect a version change when the full bundle data is already available.
 */

export const publishService = {
    /**
     * Performs an atomic publish:
     * 1. Increments the version number.
     * 2. Writes the full SubjectBundle to the 'bundles' collection.
     * 3. Updates the 'bundle_master' index which clients use for update detection.
     */
    async publishBundle(bundle: SubjectBundle, bumpType: VersionBump = 'patch'): Promise<string> {
        const newVersion = bumpVersion(bundle.version, bumpType);
        const updatedTimestamp = Date.now();

        const bundleRef = doc(db, 'bundles', bundle.id);
        const masterRef = doc(db, 'bundle_master', bundle.id);

        try {
            await runTransaction(db, async (transaction) => {
                // 1. Prepare the updated bundle document
                const finalizedBundle: SubjectBundle = {
                    ...bundle,
                    version: newVersion,
                    lastUpdated: updatedTimestamp,
                };

                // 2. Commit the full bundle data
                transaction.set(bundleRef, finalizedBundle);

                // 3. Update the Master Index (triggers the client-side onSnapshot listener)
                transaction.set(masterRef, {
                    bundleId: bundle.id,
                    version: newVersion,
                    lastUpdateDate: updatedTimestamp,
                    grade: bundle.grade ?? 7,
                    subjectId: bundle.subjectId ?? 'english',
                    serverSyncedAt: serverTimestamp() // Set by Firestore for audit trailing
                });
            });

            console.log(`[PublishService] Successfully published ${bundle.id} version ${newVersion}`);
            return newVersion;
        } catch (error) {
            console.error("[PublishService] Atomic push failed:", error);
            throw new Error("Failed to publish bundle to the cloud. Check connectivity and permissions.");
        }
    }
};
