import { useState, useEffect, useRef } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { SensoryService } from '@/core/media/SensoryService';
import { clsx } from 'clsx';
import { Delete, Check, Flame, Timer, BarChart2, Zap } from 'lucide-react';
import { useProgression } from '@/core/engine/ProgressionContext';

/**
 * MATH TABLE TEMPLATE (v1) - ENHANCED (GHOST MODE)
 * A specialized rapid-fire interaction for multiplication facts.
 * Features:
 * - Ghost Mode: Race against your personal best.
 * - Streak Counter: "On Fire" UI for repetitive mastery.
 * - Millisecond Precision: Ported from Blue-Ninja-v2.
 */

interface MathTableProps {
    data: {
        type: 'fact' | 'grid' | 'missing-multiplier';
        table: number;
        multiplier?: number;
        correctAnswer: string;
        subject?: string;
    };
    atomId: string;
    onAnswer: (answer: any, duration: number, timeTakenMs?: number) => void;
    isReviewMode: boolean;
}

const MESSAGES = ["Slay!", "Clean!", "Awesome!", "Nice!", "Perfect!", "Calculated!", "Ghost Beat!"];

export default function MathTableComponent({ data, atomId, onAnswer, isReviewMode }: MathTableProps) {
    const [inputValue, setInputValue] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
    const { stats } = useProgression();

    // Ghost Mode Stats
    const config = stats.tablesConfig;
    const personalBest = config?.personalBests?.[atomId];
    const streak = config?.factStreaks?.[atomId] || 0;

    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    // Ghost Progress Logic (using requestAnimationFrame for smooth UI)
    const [ghostProgress, setGhostProgress] = useState(0);
    const ghostTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (hasSubmitted || isReviewMode || !personalBest) return;

        const startTime = performance.now();
        const updateGhost = () => {
            const now = performance.now();
            const timeElapsed = now - startTime;
            const progress = Math.min((timeElapsed / personalBest) * 100, 100);
            setGhostProgress(progress);

            if (progress < 100) {
                ghostTimerRef.current = requestAnimationFrame(updateGhost);
            }
        };

        ghostTimerRef.current = requestAnimationFrame(updateGhost);
        return () => {
            if (ghostTimerRef.current) cancelAnimationFrame(ghostTimerRef.current);
        };
    }, [hasSubmitted, isReviewMode, personalBest]);

    // Auto-progress logic for correct answers
    useEffect(() => {
        if (hasSubmitted && inputValue.trim() === data.correctAnswer) {
            const msg = (personalBest && ghostProgress < 100)
                ? "Ghost Defeated! 👻"
                : MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

            setFeedbackMsg(msg);
            SensoryService.triggerSuccess();
        } else if (hasSubmitted) {
            SensoryService.triggerError();
        }
    }, [hasSubmitted]);

    const handleKeypadPress = (val: string) => {
        if (hasSubmitted || isReviewMode) return;
        if (inputValue.length < 5) {
            setInputValue(prev => prev + val);
        }
    };

    const handleDelete = () => {
        if (hasSubmitted || isReviewMode) return;
        setInputValue(prev => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (hasSubmitted || isReviewMode || !inputValue) return;

        submitAnswer({
            value: inputValue,
            isCorrect: inputValue.trim() === data.correctAnswer
        });
    };

    const renderQuestion = () => {
        const { table, multiplier, type } = data;
        if (type === 'missing-multiplier') {
            return (
                <div className="flex items-center gap-4 text-4xl md:text-7xl font-black text-text-main">
                    <span>{table}</span>
                    <span className="text-app-primary">×</span>
                    <span className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center border-b-8 border-app-primary text-app-primary bg-app-primary/5 rounded-t-2xl">
                        {inputValue || "?"}
                    </span>
                    <span className="text-app-primary">=</span>
                    <span>{parseInt(data.correctAnswer) * table}</span>
                </div>
            );
        }

        return (
            <div className="text-5xl md:text-8xl font-black text-text-main flex items-center gap-4">
                <span>{table}</span>
                <span className="opacity-20">×</span>
                <span>{multiplier}</span>
                <span className="opacity-20">=</span>
                <span className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center border-b-8 border-app-primary text-app-primary bg-app-primary/5 rounded-t-3xl text-center">
                    {inputValue || "?"}
                </span>
            </div>
        );
    };

    return (
        <BaseTemplateWrapper
            title={data.subject || "Arithmetic"}
            stem={data.type === 'missing-multiplier' ? "Find the missing factor." : "Calculate the product."}
            footer={null}
        >
            <div className="flex flex-col items-center py-4 relative">

                {/* 1. Ghost & Streak Status Bar */}
                <div className="w-full max-w-sm flex justify-between items-end mb-8 px-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Timer size={14} className="text-text-muted" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                {personalBest ? `Best: ${(personalBest / 1000).toFixed(2)}s` : "First Attempt"}
                            </span>
                        </div>
                        {personalBest && (
                            <div className="w-24 h-1.5 bg-app-surface rounded-full overflow-hidden border border-app-border">
                                <div
                                    className={clsx(
                                        "h-full transition-all duration-100",
                                        ghostProgress > 80 ? "bg-rose-500" : "bg-indigo-500"
                                    )}
                                    style={{ width: `${ghostProgress}%` }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {streak > 0 && (
                            <div className={clsx(
                                "flex items-center gap-1.5 px-3 py-1 rounded-full border-2 animate-bounce",
                                streak >= 5 ? "bg-orange-500 border-orange-200 text-white" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                            )}>
                                <Flame size={14} fill={streak >= 5 ? "currentColor" : "none"} />
                                <span className="text-xs font-black">{streak}</span>
                            </div>
                        )}
                        <button className="p-2 bg-app-surface border border-app-border rounded-xl text-text-muted hover:text-app-primary hover:border-app-primary transition-all">
                            <BarChart2 size={18} />
                        </button>
                    </div>
                </div>

                {/* 2. Question Display */}
                <div className="mb-12 h-32 flex items-center justify-center">
                    {renderQuestion()}
                </div>

                {/* 3. Feedback Message Overlay */}
                <div className="h-10 mb-6 flex flex-col items-center">
                    {feedbackMsg && (
                        <p className={clsx(
                            "text-2xl font-black animate-in zoom-in duration-300",
                            feedbackMsg.includes("Ghost") ? "text-indigo-500" : "text-emerald-500"
                        )}>
                            {feedbackMsg}
                        </p>
                    )}
                    {hasSubmitted && inputValue.trim() !== data.correctAnswer && (
                        <div className="flex flex-col items-center">
                            <p className="text-xs font-black text-rose-500 uppercase tracking-widest">
                                Correct Answer: {data.correctAnswer}
                            </p>
                        </div>
                    )}
                </div>

                {/* 4. 3x4 On-Screen Numpad */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-[340px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleKeypadPress(num.toString())}
                            disabled={hasSubmitted}
                            className="h-20 rounded-[24px] bg-app-surface border border-app-border text-3xl font-black text-text-main hover:bg-app-bg hover:border-app-primary hover:text-app-primary active:scale-90 transition-all shadow-sm"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleDelete}
                        disabled={hasSubmitted}
                        className="h-20 rounded-[24px] bg-app-surface border border-app-border flex items-center justify-center text-text-muted hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 active:scale-90 transition-all shadow-sm"
                    >
                        <Delete size={28} />
                    </button>
                    <button
                        onClick={() => handleKeypadPress('0')}
                        disabled={hasSubmitted}
                        className="h-20 rounded-[24px] bg-app-surface border border-app-border text-3xl font-black text-text-main hover:bg-app-bg hover:border-app-primary hover:text-app-primary active:scale-90 transition-all shadow-sm"
                    >
                        0
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={hasSubmitted || !inputValue}
                        className={clsx(
                            "h-20 rounded-[24px] flex items-center justify-center text-white transition-all shadow-xl active:scale-90 group relative overflow-hidden",
                            !inputValue || hasSubmitted ? "bg-text-muted opacity-50 cursor-not-allowed" : "bg-app-primary shadow-app-primary/30"
                        )}
                    >
                        {streak >= 3 && <Zap className="absolute -left-2 -top-2 opacity-20 group-hover:scale-150 transition-transform" size={48} />}
                        <Check size={32} strokeWidth={4} />
                    </button>
                </div>
            </div>
        </BaseTemplateWrapper>
    );
}
