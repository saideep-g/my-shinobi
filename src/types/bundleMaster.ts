/**
 * BUNDLE MASTER DOMAIN
 * 
 * Defines the schema for the "Bundle Master" document.
 * This tiny document acts as a version controller for large subject bundles,
 * allowing clients to check for updates with a single, cheap read operation.
 */

export interface BundleMaster {
    /** Unique ID for the bundle (e.g., 'grade-7-english') */
    bundleId: string;

    /** Timestamp of the last significant update (used for version checking) */
    lastUpdateDate: number;

    /** Human-readable version string (e.g., '2024.1.0') */
    version: string;

    /** SHA-256 hash or unique key of the bundle content for integrity verification */
    subjectGradeHash: string;
}

// SubjectBundle moved to src/types/bundles.ts
