/**
 * PROGRESSION & MASTERY SCHEMAS
 * The "Source of Truth" for student growth and Bayesian mastery.
 */

export interface MasteryMap {
    /** Key: Atom ID, Value: Probability of Mastery (0.0 to 1.0) */
    [atomId: string]: number;
}

export interface StudentStats {
    powerPoints: number;
    heroLevel: number;
    streakCount: number;
    lastActiveDate: string; // YYYY-MM-DD
    /** Tracks days of activity for the heat-map */
    activityLog: string[];
    /** User-selected UI layout ('quest' | 'era') */
    preferredLayout: 'quest' | 'era';
}

export interface Achievement {
    id: string;
    name: string;
    icon: string;
    unlockedAt: number;
    criteria: string;
}
