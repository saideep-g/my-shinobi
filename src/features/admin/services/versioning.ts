/**
 * VERSIONING UTILITY
 * Handles the incrementing of bundle versions using semantic versioning (SemVer) principles.
 * Ensures every curriculum update is traceable and triggers client-side cache invalidation.
 */

export type VersionBump = 'patch' | 'minor' | 'major';

/**
 * Increments a version string (e.g., '1.0.0') based on the requested bump type.
 */
export const bumpVersion = (currentVersion: string, type: VersionBump = 'patch'): string => {
    // Defensive check for missing or empty version strings
    if (!currentVersion) return '1.0.0';

    const parts = currentVersion.split('.').map(Number);

    // Basic validation to ensure we have exactly 3 numeric parts
    if (parts.length !== 3 || parts.some(isNaN)) {
        console.warn(`[Versioning] Invalid version format detected: ${currentVersion}. Resetting to 1.0.0`);
        return '1.0.0';
    }

    switch (type) {
        case 'major':
            parts[0] += 1;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1] += 1;
            parts[2] = 0;
            break;
        case 'patch':
        default:
            parts[2] += 1;
            break;
    }

    return parts.join('.');
};
