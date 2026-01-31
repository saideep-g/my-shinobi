import { useState, FormEvent } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';

/**
 * NUMERIC INPUT TEMPLATE (v1)
 * For answers requiring a specific number or mathematical result.
 */

interface NumericProps {
    data: {
        text: string;
        correctAnswer: number;
        placeholder?: string;
        tolerance?: number; // E.g., allow 0.1 difference for rounding
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export default function NumericComponent({ data, onAnswer, isReviewMode }: NumericProps) {
    const [value, setValue] = useState('');
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!value || hasSubmitted) return;

        const numValue = parseFloat(value);
        const diff = Math.abs(numValue - data.correctAnswer);
        const isCorrect = diff <= (data.tolerance || 0);

        submitAnswer({
            value: numValue,
            isCorrect
        });
    };

    return (
        <BaseTemplateWrapper title="Numeric Response" stem={data.text}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type="number"
                    step="any"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={hasSubmitted || isReviewMode}
                    placeholder={data.placeholder || "Enter your answer..."}
                    className="w-full text-3xl font-black p-6 rounded-2xl border-4 border-app-border focus:border-app-primary outline-none text-center bg-app-bg transition-all focus:ring-4 focus:ring-app-primary/10"
                    autoFocus
                />

                {!hasSubmitted && !isReviewMode && (
                    <button
                        type="submit"
                        disabled={!value}
                        className="w-full py-4 bg-app-primary text-white rounded-2xl font-bold shadow-lg shadow-app-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                    >
                        Check Answer
                    </button>
                )}

                {hasSubmitted && (
                    <div className={`p-4 rounded-xl text-center font-bold ${Math.abs(parseFloat(value) - data.correctAnswer) <= (data.tolerance || 0)
                        ? 'bg-app-accent/10 text-app-accent'
                        : 'bg-rose-50 text-rose-600'
                        }`}>
                        Correct Answer: {data.correctAnswer}
                    </div>
                )}
            </form>
        </BaseTemplateWrapper>
    );
}
