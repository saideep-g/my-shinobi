import { useState, useEffect, useRef } from 'react';

/**
 * USE AUDIO PLAYER HOOK
 * Manages the lifecycle of an HTML5 Audio object for listening exercises.
 * * Handles play/pause states, loading progress, and completion callbacks.
 */

interface AudioPlayerOptions {
    onComplete?: () => void;
    autoPlay?: boolean;
}

export const useAudioPlayer = (url: string, options: AudioPlayerOptions = {}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize the audio object
        const audio = new Audio(url);
        audioRef.current = audio;

        const handleCanPlay = () => setIsLoaded(true);
        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(100);
            options.onComplete?.();
        };
        const handleTimeUpdate = () => {
            const current = (audio.currentTime / audio.duration) * 100;
            setProgress(isNaN(current) ? 0 : current);
        };

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        if (options.autoPlay) {
            audio.play().catch(err => console.error("Autoplay blocked:", err));
            setIsPlaying(true);
        }

        // Cleanup: Stop audio if the component unmounts
        return () => {
            audio.pause();
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current = null;
        };
    }, [url]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const reset = () => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = 0;
        setProgress(0);
    };

    return { isPlaying, progress, isLoaded, togglePlay, reset };
};
