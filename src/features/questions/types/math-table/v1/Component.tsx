import { useState, useEffect } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { SensoryService } from '@/core/media/SensoryService';
import { clsx } from 'clsx';
import { Delete, Check } from 'lucide-react';

/**
 * MATH TABLE TEMPLATE (v1)
 * A specialized rapid-fire interaction for multiplication facts.
 * Features an on-screen numpad and auto-progression.
 */

interface MathTableProps {
    data: {
        type: 'fact' | 'grid' | 'missing-multiplier';
        table: number;
        multiplier?: number;
        correctAnswer: string;
        subject?: string;
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

const MESSAGES = ["Slay!", "Clean!", "Awesome!", "Nice!", "Perfect!", "Calculated!"];

export default function MathTableComponent({ data, onAnswer, isReviewMode }: MathTableProps) {
    const [inputValue, setInputValue] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    // Auto-progress logic for correct answers
    useEffect(() => {
        if (hasSubmitted && inputValue.trim() === data.correctAnswer) {
            const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
            setFeedbackMsg(msg);
            SensoryService.triggerSuccess();

            // Auto-advance after 800ms
            // Note: onAnswer has already been called via useBaseQuestion's submitAnswer
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
                <div className="flex items-center gap-4 text-4xl md:text-6xl font-black text-text-main">
                    <span>{table}</span>
                    <span>×</span>
                    <span className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-b-8 border-app-primary text-app-primary">
                        {inputValue || "?"}
                    </span>
                    <span>=</span>
                    <span>{parseInt(data.correctAnswer) * table}</span>
                </div>
            );
        }

        return (
            <div className="text-4xl md:text-6xl font-black text-text-main flex items-center gap-4">
                <span>{table}</span>
                <span className="opacity-30">×</span>
                <span>{multiplier}</span>
                <span className="opacity-30">=</span>
                <span className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-b-8 border-app-primary text-app-primary">
                    {inputValue || "?"}
                </span>
            </div>
        );
    };

    return (
        <BaseTemplateWrapper
            title={data.subject || "Arithmetic"}
            stem={data.type === 'missing-multiplier' ? "Find the missing factor." : "Calculate the product."}
            footer={null} // No sticky footer, using numpad submit
        >
            <div className="flex flex-col items-center py-4">

                {/* 1. Question Display */}
                <div className="mb-12 h-24 flex items-center justify-center">
                    {renderQuestion()}
                </div>

                {/* 2. Feedback Message Overlay */}
                <div className="h-8 mb-4">
                    {feedbackMsg && (
                        <p className="text-xl font-black text-emerald-500 animate-in zoom-in duration-300">
                            {feedbackMsg}
                        </p>
                    )}
                    {hasSubmitted && inputValue.trim() !== data.correctAnswer && (
                        <p className="text-sm font-black text-rose-500 uppercase tracking-widest">
                            {data.table} × {data.multiplier} is {data.correctAnswer}
                        </p>
                    )}
                </div>

                {/* 3. 3x4 On-Screen Numpad */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleKeypadPress(num.toString())}
                            disabled={hasSubmitted}
                            className="h-16 rounded-2xl bg-app-surface border border-app-border text-2xl font-black text-text-main hover:bg-app-bg active:scale-90 transition-all shadow-sm"
                        >
                            {num}
                        </button>
                    ))}
                    <button
                        onClick={handleDelete}
                        disabled={hasSubmitted}
                        className="h-16 rounded-2xl bg-app-surface border border-app-border flex items-center justify-center text-text-muted hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all shadow-sm"
                    >
                        <Delete size={24} />
                    </button>
                    <button
                        onClick={() => handleKeypadPress('0')}
                        disabled={hasSubmitted}
                        className="h-16 rounded-2xl bg-app-surface border border-app-border text-2xl font-black text-text-main hover:bg-app-bg active:scale-90 transition-all shadow-sm"
                    >
                        0
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={hasSubmitted || !inputValue}
                        className={clsx(
                            "h-16 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg active:scale-90",
                            !inputValue || hasSubmitted ? "bg-text-muted opacity-50 cursor-not-allowed" : "bg-app-primary shadow-app-primary/30"
                        )}
                    >
                        <Check size={28} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </BaseTemplateWrapper>
    );
}
