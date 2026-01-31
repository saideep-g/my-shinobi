import { setDoc } from 'firebase/firestore';
import { getBundleMasterDoc, getBundleDoc } from '@services/db/firestore';
import { SubjectBundle } from '@/types/bundles';
import { BundleMaster } from '@/types/bundleMaster';

/**
 * BUNDLE MANAGER (Admin Service)
 * Handles the publishing of content bundles and updating the version control master.
 */

export const bundleManager = {
    /**
     * Uploads a bundle and updates the master index to trigger client updates.
     */
    async publishBundle(bundle: SubjectBundle) {
        const bundleId = bundle.id;
        const now = Date.now();

        // 1. Prepare the Master Index Entry
        const masterData: BundleMaster = {
            bundleId: bundleId,
            lastUpdateDate: now,
            version: bundle.version,
            subjectGradeHash: `${bundleId}_v${bundle.version}_${now}`
        };

        // 2. Ensure the bundle itself has the matching timestamp
        const bundleToUpload = { ...bundle, lastUpdated: now };

        console.log(`[BundleManager] Publishing ${bundleId} version ${bundle.version}...`);

        try {
            // 3. Upload the heavy Content Bundle
            // We use setDoc to overwrite any existing bundle with the new version
            await setDoc(getBundleDoc(bundleId), bundleToUpload);
            console.log(`[BundleManager] Content uploaded.`);

            // 4. Update the Master Index
            // This is the "Trigger" - once this changes, clients will know to fetch.
            await setDoc(getBundleMasterDoc(bundleId), masterData);
            console.log(`[BundleManager] Master Index updated. Publish Complete.`);

            return true;

        } catch (error) {
            console.error("[BundleManager] Publish Failed:", error);
            throw error;
        }
    }
};
