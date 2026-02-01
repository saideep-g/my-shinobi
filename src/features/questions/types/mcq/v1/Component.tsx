import { useState } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { clsx } from 'clsx';

/**
 * MCQ TEMPLATE (v1)
 * A universal multiple-choice interaction component.
 * * Supports English (Tenses) and Math (Concepts).
 * * Uses the 'BaseTemplateWrapper' for a consistent look and feel.
 */

interface MCQProps {
    data: {
        text: string;           // The question stem
        options: string[];      // Array of choices
        correctAnswer: string;  // The exact string matching an option
        subject?: string;       // For conditional styling (e.g., 'English')
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
    isPreview?: boolean;
}

export default function MCQComponent({ data, onAnswer, isReviewMode, isPreview = false }: MCQProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode, isPreview });

    const handleSelect = (option: string) => {
        if (hasSubmitted || isReviewMode) return;
        setSelected(option);
    };

    const handleSubmit = () => {
        if (!selected) return;
        submitAnswer({
            value: selected,
            isCorrect: selected === data.correctAnswer
        });
    };

    return (
        <BaseTemplateWrapper
            title={data.subject || "Multiple Choice"}
            stem={data.text}
            footer={
                !hasSubmitted && !isReviewMode && selected && (
                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-app-primary text-white rounded-[20px] font-black uppercase tracking-widest shadow-xl shadow-app-primary/30 animate-in slide-in-from-bottom-2 duration-300"
                    >
                        Submit Answer
                    </button>
                )
            }
        >
            <div className="grid grid-cols-1 gap-3">
                {data.options.map((option, i) => {
                    const isCorrect = option === data.correctAnswer;
                    const isSelected = selected === option;

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(option)}
                            disabled={hasSubmitted || isReviewMode}
                            className={clsx(
                                "question-option w-full p-5 text-left rounded-2xl border-2 transition-all duration-200 font-medium active:scale-[0.98]",
                                !hasSubmitted && !isSelected && "border-app-border hover:border-app-primary hover:bg-app-primary/5 bg-app-surface",
                                !hasSubmitted && isSelected && "border-app-primary bg-app-primary/10 text-app-primary ring-2 ring-app-primary/20",
                                hasSubmitted && isCorrect && "border-app-accent bg-app-accent/10 text-app-accent",
                                hasSubmitted && isSelected && !isCorrect && "border-rose-500 bg-rose-50 text-rose-600",
                                hasSubmitted && !isSelected && !isCorrect && "opacity-50 border-app-border"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {hasSubmitted && isCorrect && <span className="text-xl">✅</span>}
                                {hasSubmitted && isSelected && !isCorrect && <span className="text-xl">❌</span>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </BaseTemplateWrapper>
    );
}
