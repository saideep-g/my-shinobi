/**
 * MEDIA SERVICE
 * Centralizes asset resolution for the platform.
 * * It ensures that whether an asset is stored locally in /public 
 * or remotely in a Cloud Bucket, the application resolves it correctly.
 */

export type AssetCategory = 'icons' | 'subjects' | 'audio' | 'ui';

export const MediaService = {
    /**
     * Resolves the full URL or path for a given asset.
     * @param category The functional category of the asset
     * @param fileName The name of the file (e.g., 'past-tense-intro.mp3')
     */
    resolveAsset(category: AssetCategory, fileName: string): string {
        // Determine the base path. In development, this usually points to /public.
        // In production, this could be updated to a CDN URL via environment variables.
        const baseUrl = import.meta.env.VITE_ASSET_BASE_URL || '';

        // We maintain a clean directory structure for assets
        const categoryPaths: Record<AssetCategory, string> = {
            icons: '/assets/icons',
            subjects: '/assets/subjects',
            audio: '/assets/audio',
            ui: '/assets/ui',
        };

        const path = categoryPaths[category];
        return `${baseUrl}${path}/${fileName}`;
    },

    /**
     * Helper specifically for English Listening exercises.
     * Logic can be expanded here to handle localized audio paths.
     */
    getAudioUrl(subjectId: string, audioId: string): string {
        return this.resolveAsset('audio', `${subjectId}/${audioId}.mp3`);
    }
};
