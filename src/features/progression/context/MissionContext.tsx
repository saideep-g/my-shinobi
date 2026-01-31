import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { useAuth } from '@core/auth/AuthContext';
import { missionService, DailyProgress } from '../services/missionService';

/**
 * MISSION CONTEXT
 * Monitors the daily question count and mission status.
 * Provides a real-time "Habit Loop" for the student.
 */

interface MissionContextType {
    progress: DailyProgress;
    refreshProgress: () => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [progress, setProgress] = useState<DailyProgress>({
        count: 0,
        goal: 10,
        isComplete: false,
        percent: 0
    });

    /**
     * Fetches the latest session data and recalculates progress.
     * This is called on boot and after every completed session.
     */
    const refreshProgress = async () => {
        if (!user) return;

        // Fetch all local sessions for the current user
        const sessions = await dbAdapter.getSessionsForUser(user.uid);
        const newProgress = missionService.calculateDailyProgress(sessions);
        setProgress(newProgress);
    };

    useEffect(() => {
        if (user) {
            refreshProgress();
        }
    }, [user]);

    return (
        <MissionContext.Provider value={{ progress, refreshProgress }}>
            {children}
        </MissionContext.Provider>
    );
};

export const useMission = () => {
    const context = useContext(MissionContext);
    if (!context) throw new Error('useMission must be used within MissionProvider');
    return context;
};
