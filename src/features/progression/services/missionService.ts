import { AssessmentSession } from '@/types/assessment';

/**
 * MISSION SERVICE
 * Logic for calculating daily goals and activity status.
 * This service parses the student's interaction history to measure progress.
 */

export interface DailyProgress {
    count: number;
    goal: number;
    isComplete: boolean;
    percent: number;
}

export const missionService = {
    /**
     * Calculates progress toward the daily goal (default: 10 questions).
     * Implements a 4 AM IST reset: 00:00 - 04:00 counts as the previous day.
     */
    calculateDailyProgress(sessions: AssessmentSession[], goal: number = 10): DailyProgress {
        // Offset: 4 hours in milliseconds
        const OFFSET_MS = 4 * 60 * 60 * 1000;

        // Helper to get the "Shinobi Date" by shifting the clock back 4 hours
        const getShinobiDate = (timestamp: number) =>
            new Date(timestamp - OFFSET_MS).toISOString().split('T')[0];

        const todayShinobiDate = getShinobiDate(Date.now());

        // Sum logs from sessions that fall into the current "Shinobi Day"
        const todayCount = sessions
            .filter(s => getShinobiDate(s.startTime) === todayShinobiDate)
            .reduce((acc, session) => acc + (session.logs?.length || 0), 0);

        return {
            count: todayCount,
            goal,
            isComplete: todayCount >= goal,
            percent: Math.min((todayCount / goal) * 100, 100)
        };
    }
};
