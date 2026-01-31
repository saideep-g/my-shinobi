import { dbAdapter } from '@core/database/adapter';
import { AssessmentSession, QuestionLog, SessionType } from '@/types/assessment';

/**
 * ASSESSMENT MANAGER
 * Handles the "Write-Through" logic to IndexedDB.
 * * It ensures every answer is persisted to local storage immediately.
 * * This prevents data loss in case of browser crashes or battery failure.
 */

export const assessmentManager = {
    /** 
     * Starts a new session and saves the initial shell to IDB.
     * Uses crypto.randomUUID for unique session identification.
     */
    async startSession(userId: string, type: SessionType): Promise<string> {
        const sessionId = crypto.randomUUID();
        const newSession: AssessmentSession = {
            id: sessionId,
            userId,
            type,
            status: 'ACTIVE',
            startTime: Date.now(),
            logs: [],
            pointsGained: 0
        };

        await dbAdapter.put('sessions', newSession);
        return sessionId;
    },

    /** 
     * APPEND LOG (The Write-Through Step)
     * Fetches the current session, appends the new question results, and saves back.
     */
    async appendLog(sessionId: string, log: QuestionLog): Promise<void> {
        const session = await dbAdapter.get<AssessmentSession>('sessions', sessionId);
        if (!session) return;

        session.logs.push(log);

        // Simple point logic: 10 points for correct, 2 for attempt
        if (log.isCorrect) session.pointsGained += 10;
        else session.pointsGained += 2;

        await dbAdapter.put('sessions', session);
    },

    /** 
     * Marks the session for the Sync Service to pick up later.
     * Transitions state from ACTIVE to COMPLETED.
     */
    async completeSession(sessionId: string): Promise<void> {
        const session = await dbAdapter.get<AssessmentSession>('sessions', sessionId);
        if (!session) return;

        session.status = 'COMPLETED';
        session.endTime = Date.now();
        await dbAdapter.put('sessions', session);
    }
};
