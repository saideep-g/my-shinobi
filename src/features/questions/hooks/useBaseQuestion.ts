import { useState, useEffect, useRef } from 'react';

/**
 * USE BASE QUESTION HOOK
 * Centralizes the logic for timers, response state, and interaction lifecycle.
 * * This hook ensures that every question—regardless of subject—reports 
 * time-spent and correctness in a standardized format.
 */

interface UseBaseQuestionProps {
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export const useBaseQuestion = ({ onAnswer, isReviewMode }: UseBaseQuestionProps) => {
    const [startTime] = useState<number>(Date.now());
    const [hasSubmitted, setHasSubmitted] = useState(false);
    // Using useRef for duration tracking if needed in callbacks
    const durationRef = useRef<number>(0);

    // We track the elapsed time locally for UI feedback (if needed)
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (isReviewMode || hasSubmitted) return;

        const interval = setInterval(() => {
            const currentDuration = Math.floor((Date.now() - startTime) / 1000);
            setElapsed(currentDuration);
            durationRef.current = currentDuration;
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime, isReviewMode, hasSubmitted]);

    const submitAnswer = (answer: any) => {
        if (hasSubmitted || isReviewMode) return;

        const finalDuration = Math.floor((Date.now() - startTime) / 1000);
        setHasSubmitted(true);
        onAnswer(answer, finalDuration);
    };

    return {
        elapsed,
        hasSubmitted,
        submitAnswer
    };
};
