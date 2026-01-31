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
     * Calculates progress toward the daily goal (e.g., 10 questions).
     * This is computed on-the-fly from the local sessions buffer.
     */
    calculateDailyProgress(sessions: AssessmentSession[], goal: number = 10): DailyProgress {
        const today = new Date().toISOString().split('T')[0];

        // Filter sessions from today and sum up the logs (questions answered)
        const todayCount = sessions
            .filter(s => new Date(s.startTime).toISOString().split('T')[0] === today)
            .reduce((acc, session) => acc + (session.logs?.length || 0), 0);

        return {
            count: todayCount,
            goal,
            isComplete: todayCount >= goal,
            percent: Math.min((todayCount / goal) * 100, 100)
        };
    }
};
