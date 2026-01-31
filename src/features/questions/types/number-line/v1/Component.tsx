import { useState } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';

/**
 * NUMBER LINE TEMPLATE (v1)
 * Visual positioning tool for values and fractions.
 */

interface NumberLineProps {
    data: {
        text: string;
        min: number;
        max: number;
        step: number;
        correctAnswer: number;
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export default function NumberLineComponent({ data, onAnswer, isReviewMode }: NumberLineProps) {
    const [value, setValue] = useState(data.min);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    return (
        <BaseTemplateWrapper title="Visual Math" stem={data.text}>
            <div className="py-16 px-6">
                <div className="relative h-2 bg-app-border rounded-full shadow-inner">
                    {/* Ticks */}
                    {Array.from({ length: Math.round((data.max - data.min) / data.step) + 1 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute top-0 w-0.5 h-5 bg-app-border -translate-y-1.5"
                            style={{ left: `${(i * data.step / (data.max - data.min)) * 100}%` }}
                        >
                            {(i % 2 === 0 || data.max - data.min <= 10) && (
                                <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-text-muted">
                                    {data.min + (i * data.step)}
                                </span>
                            )}
                        </div>
                    ))}

                    <input
                        type="range"
                        min={data.min}
                        max={data.max}
                        step={data.step}
                        value={value}
                        onChange={(e) => !hasSubmitted && setValue(Number(e.target.value))}
                        className="absolute -top-4 w-full h-10 opacity-0 cursor-pointer z-10"
                    />

                    {/* Visual Indicator (The Slider Thumb Mockup) */}
                    <div
                        className="absolute -top-10 -translate-x-1/2 flex flex-col items-center transition-all duration-150 ease-out"
                        style={{ left: `${((value - data.min) / (data.max - data.min)) * 100}%` }}
                    >
                        <div className="bg-app-primary text-white px-4 py-1.5 rounded-2xl font-black text-xl shadow-2xl mb-1 ring-4 ring-white dark:ring-app-surface">
                            {value}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-app-primary ring-4 ring-white dark:ring-app-surface shadow-xl" />
                    </div>

                    {/* Correct Answer Indicator (Revealed after submission) */}
                    {hasSubmitted && value !== data.correctAnswer && (
                        <div
                            className="absolute -top-12 -translate-x-1/2 opacity-60"
                            style={{ left: `${((data.correctAnswer - data.min) / (data.max - data.min)) * 100}%` }}
                        >
                            <div className="bg-app-accent text-white px-2 py-0.5 rounded-lg font-bold text-xs mb-1">
                                Goal: {data.correctAnswer}
                            </div>
                            <div className="w-4 h-4 rounded-full bg-app-accent mx-auto" />
                        </div>
                    )}
                </div>
            </div>

            {!hasSubmitted && (
                <button
                    onClick={() => submitAnswer({ value, isCorrect: value === data.correctAnswer })}
                    className="w-full mt-10 py-4 bg-app-primary text-white rounded-2xl font-bold shadow-lg shadow-app-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Confirm Position
                </button>
            )}

            {hasSubmitted && (
                <div className={`mt-4 p-4 rounded-2xl text-center font-black uppercase tracking-widest text-sm ${value === data.correctAnswer ? 'bg-app-accent/10 text-app-accent' : 'bg-rose-500/10 text-rose-600'
                    }`}>
                    {value === data.correctAnswer ? 'Perfect Calibration' : 'Calibration Error'}
                </div>
            )}
        </BaseTemplateWrapper>
    );
}
