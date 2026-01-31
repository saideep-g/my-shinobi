import React from 'react';
import { clsx } from 'clsx';
import { Lock, CheckCircle2, Play } from 'lucide-react';

/**
 * PATH NODE
 * A visual waypoint on the Path to Master.
 * States: LOCKED (Prereqs not met), UNLOCKED (Ready), MASTERED (Prob > 0.85)
 */

interface PathNodeProps {
    title: string;
    mastery: number;
    isUnlocked: boolean;
    isSuggested?: boolean;
    onClick: () => void;
}

export const PathNode: React.FC<PathNodeProps> = ({
    title,
    mastery,
    isUnlocked,
    isSuggested,
    onClick
}) => {
    const isMastered = mastery >= 0.85;

    return (
        <div className="flex flex-col items-center gap-2 group">
            <button
                onClick={isUnlocked ? onClick : undefined}
                disabled={!isUnlocked}
                data-testid="start-quest-btn"
                className={clsx(
                    "w-24 h-24 rounded-[32px] flex items-center justify-center transition-all duration-500 relative shadow-xl border-4",
                    !isUnlocked && "bg-app-bg border-app-border text-text-muted cursor-not-allowed opacity-60",
                    isUnlocked && !isMastered && "bg-app-surface border-app-primary text-app-primary hover:scale-110 active:scale-95",
                    isMastered && "bg-app-accent/10 border-app-accent text-app-accent hover:scale-110 active:scale-95",
                    isSuggested && "animate-pulse ring-4 ring-app-primary/30"
                )}
            >
                {/* Status Icon */}
                {!isUnlocked && <Lock size={24} className="opacity-50" />}
                {isMastered && <CheckCircle2 size={36} fill="currentColor" className="text-white bg-app-accent rounded-full" />}
                {isUnlocked && !isMastered && <Play size={28} fill="currentColor" className="ml-1" />}

                {/* Floating Mastery Badge */}
                {isUnlocked && (
                    <div className="absolute -top-3 -right-3 bg-app-surface border-2 border-app-border px-2 py-1 rounded-xl text-[10px] font-black shadow-lg">
                        {Math.round(mastery * 100)}%
                    </div>
                )}

                {/* Suggested indicator Label */}
                {isSuggested && !isMastered && (
                    <div className="absolute -bottom-2 bg-app-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
                        Recommended
                    </div>
                )}
            </button>

            <span className={clsx(
                "text-[11px] font-black uppercase text-center max-w-[120px] leading-tight transition-colors px-2",
                isUnlocked ? "text-text-main" : "text-text-muted"
            )}>
                {title}
            </span>
        </div>
    );
};
