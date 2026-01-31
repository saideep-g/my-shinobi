import { useState } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { clsx } from 'clsx';

/**
 * MATCHING TEMPLATE (v1)
 * Connects prompts with their corresponding answers.
 */

interface MatchingProps {
    data: {
        text: string;
        pairs: { left: string; right: string }[];
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export default function MatchingComponent({ data, onAnswer, isReviewMode }: MatchingProps) {
    const [selections, setSelections] = useState<Record<string, string>>({});
    const [activeLeft, setActiveLeft] = useState<string | null>(null);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    const handleMatch = (right: string) => {
        if (!activeLeft || hasSubmitted) return;
        setSelections(prev => ({ ...prev, [activeLeft]: right }));
        setActiveLeft(null);
    };

    const handleCheck = () => {
        const isCorrect = data.pairs.every(pair => selections[pair.left] === pair.right);
        submitAnswer({ value: selections, isCorrect });
    };

    const isMatched = (right: string) => Object.values(selections).includes(right);

    return (
        <BaseTemplateWrapper title="Knowledge Match" stem={data.text}>
            <div className="grid grid-cols-2 gap-6">
                {/* Left Column (Prompts) */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest text-center px-4">Prompts</p>
                    {data.pairs.map(p => (
                        <button
                            key={p.left}
                            onClick={() => !hasSubmitted && setActiveLeft(p.left)}
                            className={clsx(
                                "w-full p-4 text-sm rounded-2xl border-2 transition-all font-bold text-left",
                                activeLeft === p.left ? 'border-app-primary bg-app-primary/10 text-app-primary' :
                                    selections[p.left] ? 'border-app-accent/30 bg-app-accent/5 text-app-accent' : 'border-app-border bg-app-surface'
                            )}
                        >
                            {p.left}
                        </button>
                    ))}
                </div>

                {/* Right Column (Matches) */}
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest text-center px-4">Definitions</p>
                    {data.pairs.map(p => p.right).sort().map(r => (
                        <button
                            key={r}
                            onClick={() => handleMatch(r)}
                            disabled={hasSubmitted || !activeLeft || isMatched(r)}
                            className={clsx(
                                "w-full p-4 text-sm rounded-2xl border-2 border-dashed transition-all text-left h-full flex items-center",
                                isMatched(r) ? "border-app-border bg-app-bg text-text-muted opacity-40" : "border-app-primary/30 hover:border-app-primary bg-app-surface text-text-main"
                            )}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {!hasSubmitted && (
                <button
                    onClick={handleCheck}
                    disabled={Object.keys(selections).length < data.pairs.length}
                    className="w-full mt-8 py-4 bg-app-primary text-white rounded-2xl font-bold shadow-lg shadow-app-primary/20 hover:brightness-110 disabled:opacity-50 transition-all"
                >
                    Submit Matches
                </button>
            )}

            {hasSubmitted && (
                <div className="mt-6 p-4 bg-app-surface border border-app-border rounded-xl space-y-2">
                    <p className="text-[10px] uppercase font-black text-text-muted">Correct Links:</p>
                    {data.pairs.map(pair => (
                        <div key={pair.left} className="flex justify-between text-xs">
                            <span className="text-text-muted italic">{pair.left}</span>
                            <span className="font-bold text-app-accent">➔ {pair.right}</span>
                        </div>
                    ))}
                </div>
            )}
        </BaseTemplateWrapper>
    );
}
