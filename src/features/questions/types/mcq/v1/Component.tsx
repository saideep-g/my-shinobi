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
}

export default function MCQComponent({ data, onAnswer, isReviewMode }: MCQProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    const handleSelect = (option: string) => {
        if (hasSubmitted || isReviewMode) return;
        setSelected(option);

        // Auto-submit on selection for a faster mobile "Quest" experience
        submitAnswer({
            value: option,
            isCorrect: option === data.correctAnswer
        });
    };

    return (
        <BaseTemplateWrapper
            title={data.subject || "Multiple Choice"}
            stem={data.text}
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
                                "w-full p-5 text-left rounded-2xl border-2 transition-all duration-200 font-medium active:scale-[0.98]",
                                !hasSubmitted && "border-app-border hover:border-app-primary hover:bg-app-primary/5 bg-app-surface",
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
