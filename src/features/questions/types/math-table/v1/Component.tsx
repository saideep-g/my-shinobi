import { useState, useEffect, useRef } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { clsx } from 'clsx';

/**
 * MATH TABLE TEMPLATE (v1)
 * A specialized interaction for multiplication facts.
 * Supports:
 * 1. 'fact' mode: Single multiplication question (e.g., 7 x 8).
 * 2. 'grid' mode: (Future) Full table completion.
 */

interface MathTableProps {
    data: {
        type: 'fact' | 'grid';
        table: number;
        multiplier?: number;
        correctAnswer: string;
        subject?: string;
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export default function MathTableComponent({ data, onAnswer, isReviewMode }: MathTableProps) {
    const [inputValue, setInputValue] = useState('');
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input on mount
    useEffect(() => {
        if (!hasSubmitted && !isReviewMode) {
            inputRef.current?.focus();
        }
    }, [hasSubmitted, isReviewMode]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (hasSubmitted || isReviewMode || !inputValue) return;

        submitAnswer({
            value: inputValue,
            isCorrect: inputValue.trim() === data.correctAnswer
        });
    };

    return (
        <BaseTemplateWrapper
            title={data.subject || "Arithmetic"}
            stem={data.type === 'fact' ? `What is ${data.table} × ${data.multiplier}?` : `Complete the table of ${data.table}`}
            footer={
                !hasSubmitted && !isReviewMode && inputValue && (
                    <button
                        onClick={() => handleSubmit()}
                        className="w-full py-4 bg-app-primary text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-app-primary/30 animate-in slide-in-from-bottom-2 duration-300"
                    >
                        Check Product
                    </button>
                )
            }
        >
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center py-8">
                <div className="flex items-center gap-6">
                    <div className="text-4xl md:text-6xl font-black text-text-main opacity-20">
                        {data.table} × {data.multiplier} =
                    </div>

                    <input
                        ref={inputRef}
                        type="number"
                        inputMode="numeric"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={hasSubmitted || isReviewMode}
                        placeholder="?"
                        className={clsx(
                            "w-24 md:w-32 h-24 md:h-32 text-4xl md:text-5xl font-black text-center rounded-[32px] border-4 outline-none transition-all duration-300",
                            !hasSubmitted && "bg-app-bg border-app-border focus:border-app-primary focus:bg-app-surface shadow-inner focus:shadow-xl focus:shadow-app-primary/10",
                            hasSubmitted && inputValue.trim() === data.correctAnswer && "bg-app-accent/10 border-app-accent text-app-accent shadow-none",
                            hasSubmitted && inputValue.trim() !== data.correctAnswer && "bg-rose-50 border-rose-500 text-rose-600 shadow-none"
                        )}
                    />
                </div>

                {hasSubmitted && inputValue.trim() !== data.correctAnswer && (
                    <div className="mt-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Pedagogical Correction</p>
                        <p className="text-2xl font-black text-text-main">
                            {data.table} × {data.multiplier} is <span className="text-app-accent border-b-4 border-app-accent/20">{data.correctAnswer}</span>
                        </p>
                    </div>
                )}
            </form>
        </BaseTemplateWrapper>
    );
}
