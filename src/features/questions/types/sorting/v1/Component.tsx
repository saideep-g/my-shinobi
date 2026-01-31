import { useState } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { clsx } from 'clsx';
import { MoveUp, MoveDown } from 'lucide-react';

/**
 * SORTING / REORDER TEMPLATE (v1)
 * Allows students to arrange a list of items in a specific sequence.
 */

interface SortingProps {
    data: {
        text: string;
        items: string[];      // Initial scrambled items
        correctOrder: string[]; // The target sequence
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export default function SortingComponent({ data, onAnswer, isReviewMode }: SortingProps) {
    const [items, setItems] = useState<string[]>(data.items);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (hasSubmitted || isReviewMode) return;
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setItems(newItems);
    };

    const handleCheck = () => {
        const isCorrect = items.every((val, index) => val === data.correctOrder[index]);
        submitAnswer({ value: items, isCorrect });
    };

    return (
        <BaseTemplateWrapper title="Sequence Challenge" stem={data.text}>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={`${item}-${index}`}
                        className={clsx(
                            "flex items-center justify-between p-4 bg-app-surface border-2 rounded-2xl transition-all",
                            hasSubmitted && item === data.correctOrder[index] ? "border-app-accent" : "border-app-border"
                        )}
                    >
                        <span className="font-bold text-text-main">{item}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => moveItem(index, 'up')}
                                disabled={index === 0 || hasSubmitted}
                                className="p-2 hover:bg-app-bg rounded-lg disabled:opacity-20 text-text-muted"
                                aria-label="Move Up"
                            >
                                <MoveUp size={18} />
                            </button>
                            <button
                                onClick={() => moveItem(index, 'down')}
                                disabled={index === items.length - 1 || hasSubmitted}
                                className="p-2 hover:bg-app-bg rounded-lg disabled:opacity-20 text-text-muted"
                                aria-label="Move Down"
                            >
                                <MoveDown size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {!hasSubmitted && (
                    <button
                        onClick={handleCheck}
                        className="w-full mt-6 py-4 bg-app-primary text-white rounded-2xl font-bold shadow-lg shadow-app-primary/20 hover:brightness-110 active:scale-95 transition-all"
                    >
                        Confirm Order
                    </button>
                )}

                {hasSubmitted && (
                    <div className="mt-4 p-4 bg-app-surface border border-app-border rounded-xl">
                        <p className="text-xs uppercase font-black text-text-muted mb-2">Target Sequence:</p>
                        <p className="font-bold text-app-accent">{data.correctOrder.join(" → ")}</p>
                    </div>
                )}
            </div>
        </BaseTemplateWrapper>
    );
}
