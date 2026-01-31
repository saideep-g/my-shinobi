import { useCallback } from 'react';
import { SensoryService } from '@core/media/SensoryService';

/**
 * USE FEEDBACK HOOK
 * Provides a simple abstraction for UI components to trigger sensory feedback.
 * Decouples the UI from the underlying browser/media APIs.
 */

export const useFeedback = () => {
    /**
     * Triggers success audio and haptics.
     * Ideal for correct answers or completed steps.
     */
    const playSuccess = useCallback(() => {
        SensoryService.triggerSuccess();
    }, []);

    /**
     * Triggers error audio and haptics.
     * Ideal for incorrect answers.
     */
    const playError = useCallback(() => {
        SensoryService.triggerError();
    }, []);

    /**
     * Triggers a subtle tap sound and micro-vibration.
     * Ideal for button presses or menu navigation.
     */
    const playTap = useCallback(() => {
        SensoryService.playSound('CLICK', 0.2);
        SensoryService.vibrate('light');
    }, []);

    return { playSuccess, playError, playTap };
};
