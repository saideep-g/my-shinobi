import React, { createContext, useContext, useState, useCallback } from 'react';
import { SubjectBundle } from '@/types/bundles';
import { QuestionBase } from '@/types/questions';
import { selectNextQuestion } from './selection';
import { useIntelligence } from './IntelligenceContext';
import { useAuth } from '@core/auth/AuthContext';
import { assessmentManager } from '@/features/assessment/services/assessmentManager';
import { logService } from '@/features/assessment/services/logService';
import { useProgression } from './ProgressionContext';
import { PROGRESSION_CONSTANTS } from './progression';
import { SensoryService } from '@core/media/SensoryService';
import { useMission } from '@/features/progression/context/MissionContext';

/**
 * SESSION CONTEXT
 * Manages the active flow of a learning session (Quest).
 * * Integrates the Selection Engine with the Bayesian Mastery system.
 * * Implements "Write-Through" buffering to IndexedDB for safety.
 */

interface SessionContextType {
    activeBundle: SubjectBundle | null;
    currentQuestion: QuestionBase | null;
    startSession: (bundle: SubjectBundle) => Promise<void>;
    submitResponse: (isCorrect: boolean, duration: number) => Promise<void>;
    isSessionComplete: boolean;
    recentIds: string[];
    activeSessionId: string | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { mastery, recordAttempt, getAtomMastery } = useIntelligence();
    const { addXP, updateStreak } = useProgression();
    const { refreshProgress } = useMission();

    const [activeBundle, setActiveBundle] = useState<SubjectBundle | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionBase | null>(null);
    const [recentIds, setRecentIds] = useState<string[]>([]);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    /**
     * Initializes a new learning session with a specific subject bundle.
     * Also creates a formal AssessmentSession in IndexedDB.
     */
    const startSession = async (bundle: SubjectBundle) => {
        if (!user) return;

        console.log(`[Session] Starting session for: ${bundle.id}`);

        // 1. Initialize DB Session (Write-Through Buffer)
        const sid = await assessmentManager.startSession(user.uid, 'PRACTICE');
        setActiveSessionId(sid);

        setActiveBundle(bundle);
        setIsSessionComplete(false);
        setRecentIds([]);

        // 2. Select the very first question
        const firstQ = selectNextQuestion(bundle, mastery, []);
        setCurrentQuestion(firstQ);
    };

    /**
     * Processes a student answer and triggers the selection of the next question.
     * Ensures the response is logged to the local buffer immediately.
     */
    const submitResponse = useCallback(async (isCorrect: boolean, duration: number) => {
        if (!currentQuestion || !activeBundle || !activeSessionId) return;

        // 0. Trigger Sensory Feedback (Mobile Vibrate + Sound)
        if (isCorrect) {
            SensoryService.triggerSuccess();
        } else {
            SensoryService.triggerError();
        }

        console.log(`[Session] Submitting response for ${currentQuestion.id}: ${isCorrect ? 'CORRECT' : 'WRONG'}`);

        // 1. Capture mastery before calculation
        const mBefore = mastery[currentQuestion.atomId] || 0.25;

        // 2. Record the attempt in the Bayesian engine to update mastery probabilities
        await recordAttempt(currentQuestion.atomId, isCorrect);

        // 3. Capture mastery after calculation
        const mAfter = getAtomMastery(currentQuestion.atomId);

        // 4. Generate and Buffer Log to IndexedDB (Write-Through)
        const log = logService.createLog(currentQuestion, isCorrect, duration, mBefore, mAfter);
        await assessmentManager.appendLog(activeSessionId, log);

        // 5. Award XP based on result
        const xpAmount = isCorrect ? PROGRESSION_CONSTANTS.XP_PER_CORRECT : PROGRESSION_CONSTANTS.XP_PER_ATTEMPT;
        await addXP(xpAmount);
        await updateStreak();
        await refreshProgress(); // Update Daily Mission Progress

        // 5. Add current question to recent history (queue of 10)
        const updatedRecent = [...recentIds, currentQuestion.id].slice(-10);
        setRecentIds(updatedRecent);

        // 6. Select the next question based on the UPDATED mastery and history
        const nextQ = selectNextQuestion(activeBundle, mastery, updatedRecent);

        if (nextQ) {
            setCurrentQuestion(nextQ);
        } else {
            console.log("[Session] No more suitable questions found. Finalizing session...");
            await assessmentManager.completeSession(activeSessionId);
            setIsSessionComplete(true);
            setCurrentQuestion(null);
        }
    }, [currentQuestion, activeBundle, activeSessionId, mastery, recentIds, recordAttempt, getAtomMastery, addXP, updateStreak]);

    return (
        <SessionContext.Provider value={{
            activeBundle,
            currentQuestion,
            startSession,
            submitResponse,
            isSessionComplete,
            recentIds,
            activeSessionId
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) throw new Error('useSession must be used within SessionProvider');
    return context;
};
