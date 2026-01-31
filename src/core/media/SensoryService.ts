/**
 * SENSORY SERVICE
 * Manages audio feedback and mobile haptic patterns.
 * * Uses a sound pool to prevent audio "clipping" during fast interactions.
 * * Implements common dopamine triggers for gamified learning.
 */

type SoundEffect = 'CORRECT' | 'WRONG' | 'LEVEL_UP' | 'MISSION_COMPLETE' | 'CLICK';

const SOUND_PATHS: Record<SoundEffect, string> = {
    CORRECT: '/assets/audio/fx/success_chime.mp3',
    WRONG: '/assets/audio/fx/error_thud.mp3',
    LEVEL_UP: '/assets/audio/fx/fanfare_levelup.mp3',
    MISSION_COMPLETE: '/assets/audio/fx/mission_complete.mp3',
    CLICK: '/assets/audio/fx/ui_tap.mp3',
};

export const SensoryService = {
    /**
     * Plays a sound effect with optional volume control.
     * Creates a new Audio instance per play to allow overlapping sounds.
     */
    playSound(effect: SoundEffect, volume: number = 0.5) {
        try {
            const audio = new Audio(SOUND_PATHS[effect]);
            audio.volume = volume;
            audio.play().catch(() => {
                // Browser policies often block audio until first user interaction
                console.debug("[SensoryService] Audio play deferred or blocked:", effect);
            });
        } catch (err) {
            console.warn("[SensoryService] Failed to initialize audio:", err);
        }
    },

    /**
     * Triggers haptic feedback (vibration) for supported devices.
     * Patterns are designed to differentiate success from failure.
     */
    vibrate(pattern: 'success' | 'error' | 'light') {
        if (!('vibrate' in navigator)) return;

        switch (pattern) {
            case 'success':
                // Double micro-tap
                navigator.vibrate([10, 30, 10]);
                break;
            case 'error':
                // Heavier double-tap for negative reinforcement
                navigator.vibrate([50, 100, 50]);
                break;
            case 'light':
                // Single subtle tap for button clicks
                navigator.vibrate(10);
                break;
        }
    },

    /**
     * Unified trigger for an "Excellence" event (e.g., correct answer).
     */
    triggerSuccess() {
        this.playSound('CORRECT', 0.5);
        this.vibrate('success');
    },

    /**
     * Unified trigger for a "Correction" event (e.g., wrong answer).
     */
    triggerError() {
        this.playSound('WRONG', 0.3); // Lower volume to avoid harshness
        this.vibrate('error');
    },

    /**
     * Trigger for milestone achievements.
     */
    triggerMilestone() {
        this.playSound('LEVEL_UP', 0.6);
        this.vibrate('success');
    }
};
