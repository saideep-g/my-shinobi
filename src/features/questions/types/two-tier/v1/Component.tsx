import { useState } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { clsx } from 'clsx';

/**
 * TWO-TIER REASONING TEMPLATE (v1)
 * A two-step interaction designed for deep pedagogical analysis.
 * * Tier 1: Primary Answer.
 * * Tier 2: Reasoning/Justification.
 */

interface TwoTierProps {
    data: {
        text: string;
        tier1: {
            options: string[];
            correctAnswer: string;
        };
        tier2: {
            prompt: string;
            options: string[];
            correctAnswer: string;
        };
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export default function TwoTierComponent({ data, onAnswer, isReviewMode }: TwoTierProps) {
    const [t1Answer, setT1Answer] = useState<string | null>(null);
    const [t2Answer, setT2Answer] = useState<string | null>(null);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    const handleT2Select = (option: string) => {
        if (hasSubmitted || isReviewMode || !t1Answer) return;
        setT2Answer(option);

        submitAnswer({
            tier1Value: t1Answer,
            tier2Value: option,
            isCorrect: t1Answer === data.tier1.correctAnswer && option === data.tier2.correctAnswer,
            t1Correct: t1Answer === data.tier1.correctAnswer,
            t2Correct: option === data.tier2.correctAnswer
        });
    };

    return (
        <BaseTemplateWrapper title="Two-Tier Analysis" stem={data.text}>
            <div className="space-y-8">
                {/* Tier 1: The Decision */}
                <div className="space-y-3">
                    <p className="text-xs font-black text-text-muted uppercase tracking-tighter">Step 1: Your Answer</p>
                    <div className="grid grid-cols-2 gap-2">
                        {data.tier1.options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => !hasSubmitted && setT1Answer(opt)}
                                disabled={hasSubmitted || isReviewMode}
                                className={clsx(
                                    "p-4 rounded-xl border-2 transition-all font-bold",
                                    t1Answer === opt ? "border-app-primary bg-app-primary/5 text-app-primary" : "border-app-border",
                                    hasSubmitted && opt === data.tier1.correctAnswer && "border-app-accent bg-app-accent/10"
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tier 2: The Reasoning (Revealed only after T1 is picked) */}
                {t1Answer && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="h-px bg-app-border w-full" />
                        <p className="text-sm font-bold text-text-main">{data.tier2.prompt}</p>
                        <div className="space-y-2">
                            {data.tier2.options.map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => handleT2Select(opt)}
                                    disabled={hasSubmitted || isReviewMode}
                                    className={clsx(
                                        "w-full p-4 text-left rounded-xl border-2 transition-all text-sm",
                                        t2Answer === opt ? "border-app-primary bg-app-primary/5" : "border-app-border",
                                        hasSubmitted && opt === data.tier2.correctAnswer && "border-app-accent bg-app-accent/10 text-app-accent font-bold"
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </BaseTemplateWrapper>
    );
}
