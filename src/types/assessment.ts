/**
 * ASSESSMENT & SESSION SCHEMAS
 * Manages the state of active learning sessions and the write-through buffer.
 */

export type SessionType = 'DIAGNOSTIC' | 'PRACTICE' | 'DAILY_MISSION' | 'BOSS_BATTLE';
export type SessionStatus = 'IDLE' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'SYNCED';

export interface QuestionLog {
    questionId: string;
    isCorrect: boolean;
    /** Time spent in seconds */
    duration: number;
    timestamp: number;
    /** Bayesian mastery value before this answer (0.0 - 1.0) */
    masteryBefore: number;
    /** Bayesian mastery value after engine calculation */
    masteryAfter: number;
    /** The curriculum atom this question belongs to */
    atomId: string;
    /** Captured student misconception if applicable */
    misconceptionTag?: string;
}

export interface AssessmentSession {
    id: string;
    userId: string;
    type: SessionType;
    status: SessionStatus;
    startTime: number;
    endTime?: number;
    /** The local buffer of logs waiting to be synced to the monthly bucket */
    logs: QuestionLog[];
    pointsGained: number;
}
