/**
 * PROGRESSION & MASTERY SCHEMAS
 * The "Source of Truth" for student growth and Bayesian mastery.
 */

export interface MasteryMap {
    /** Key: Atom ID, Value: Probability of Mastery (0.0 to 1.0) */
    [atomId: string]: number;
}

export interface StudentStats {
    displayName?: string; // For Admin identification
    powerPoints: number;
    heroLevel: number;
    streakCount: number;
    lastActiveDate: string; // YYYY-MM-DD
    activityLog: string[];
    preferredLayout: 'quest' | 'era';

    // Cross-Device Persistence Fields
    grade: number;
    assignedChapterIds: string[];

    achievements?: Achievement[];
    avatarId?: string;
    sessionConfig?: {
        questionsPerSession: number;
        isDeveloperMode: boolean;
    };

    // Multiplication Mastery (Feature Parity)
    tablesConfig?: {
        currentPathStage: number; // e.g., 7 means mastering the 7s table
        tableStats: Record<number, {
            accuracy: number;
            avgSpeed: number;
            attempts: number;
            status: 'LOCKED' | 'PRACTICING' | 'MASTERED';
        }>;
        factStreaks: Record<string, number>; // atomId -> current streak
        personalBests: Record<string, number>; // atomId -> best time in MS
    };
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: number;
    criteria: string;
}
