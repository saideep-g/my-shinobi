/**
 * PROGRESSION & MASTERY SCHEMAS
 * The "Source of Truth" for student growth and Bayesian mastery.
 */

export interface MasteryMap {
    /** Key: Atom ID, Value: Probability of Mastery (0.0 to 1.0) */
    [atomId: string]: number;
}

export interface StudentStats {
    displayName?: string; // NEW: The student's name for Admin identification
    powerPoints: number;
    heroLevel: number;
    streakCount: number;
    lastActiveDate: string; // YYYY-MM-DD
    /** Tracks days of activity for the heat-map */
    activityLog: string[];
    /** User-selected UI layout ('quest' | 'era') */
    preferredLayout: 'quest' | 'era';
    /** Collection of earned badges */
    achievements?: Achievement[];
    /** Persisted avatar preference */
    avatarId?: string;
    /** Admin-controlled session constraints */
    sessionConfig?: {
        questionsPerSession: number; // e.g., 3 for test, 20 for standard
        isDeveloperMode: boolean;
    };
    // NEW: Track the student's current grade (e.g., 2 or 7)
    grade: number;
    // NEW: List of Chapter IDs currently assigned by the parent/admin
    assignedChapterIds: string[];
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: number;
    criteria: string;
}
