import { useState, useEffect } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { useAuth } from '@core/auth/AuthContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

/**
 * WEEKLY STATS HOOK
 * Aggregates student performance data for the current calendar week.
 * This is used to populate the "Parental Report Card".
 */

export interface WeeklyStats {
    weekLabel: string;
    questionsAnswered: number;
    sessionsCompleted: number;
    currentStreak: number;
    currentLevel: number;
}

export const useWeeklyStats = () => {
    const { user } = useAuth();
    const { stats } = useProgression();
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const calculateStats = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const now = new Date();
                // Calculate start/end of current week (Sunday to Saturday)
                const start = startOfWeek(now);
                const end = endOfWeek(now);

                // 1. Fetch all local sessions for the user from IndexedDB
                const allSessions = await dbAdapter.getSessionsForUser(user.uid);

                // 2. Filter for sessions that occurred this week
                const thisWeekSessions = allSessions.filter(session => {
                    const sessionDate = new Date(session.startTime);
                    return isWithinInterval(sessionDate, { start, end });
                });

                // 3. Aggregate data: count questions answered across all sessions
                const questionsAnswered = thisWeekSessions.reduce(
                    (acc, session) => acc + (session.logs?.length || 0), 0
                );

                setWeeklyStats({
                    weekLabel: `${start.toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
                    questionsAnswered,
                    sessionsCompleted: thisWeekSessions.filter(s => s.status === 'COMPLETED').length,
                    currentStreak: stats.streakCount,
                    currentLevel: stats.heroLevel
                });
            } catch (error) {
                console.error("[useWeeklyStats] Error calculating stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        calculateStats();
    }, [user, stats]);

    return { weeklyStats, isLoading };
};
