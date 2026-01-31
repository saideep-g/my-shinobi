import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

/**
 * AUDIO PLAYER UI
 * A clean, accessible interface for English listening exercises.
 * * Features a progress ring or bar and simple playback controls.
 */

interface AudioPlayerProps {
    url: string;
    title?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ url, title }) => {
    const { isPlaying, progress, isLoaded, togglePlay, reset } = useAudioPlayer(url);

    return (
        <div className="w-full p-6 bg-app-bg rounded-2xl border border-app-border flex items-center gap-6 shadow-sm">
            {/* Play/Pause Button */}
            <button
                onClick={togglePlay}
                disabled={!isLoaded}
                className="w-14 h-14 flex items-center justify-center bg-app-primary text-white rounded-full shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
                {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
            </button>

            {/* Info & Progress */}
            <div className="flex-1 space-y-2">
                {title && <p className="text-xs font-black text-text-muted uppercase tracking-widest">{title}</p>}
                <div className="h-2 w-full bg-app-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-app-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Reset Control */}
            <button
                onClick={reset}
                className="p-2 text-text-muted hover:text-app-primary transition-colors"
            >
                <RotateCcw size={20} />
            </button>
        </div>
    );
};
