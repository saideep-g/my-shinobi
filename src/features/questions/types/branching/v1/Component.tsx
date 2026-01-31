import { useState } from 'react';
import { BaseTemplateWrapper } from '../../../components/BaseTemplateWrapper';
import { useBaseQuestion } from '../../../hooks/useBaseQuestion';
import { clsx } from 'clsx';

/**
 * MCQ BRANCHING TEMPLATE (v1)
 * Implements remedial branching logic.
 * * If T1 is wrong, the 'Branch' question is triggered to diagnose the error.
 */

interface BranchingProps {
    data: {
        text: string;
        tier1: {
            options: string[];
            correctAnswer: string;
        };
        branches: {
            [wrongOption: string]: {
                text: string;
                options: string[];
                correctAnswer: string;
            };
        };
    };
    onAnswer: (answer: any, duration: number) => void;
    isReviewMode: boolean;
}

export default function BranchingComponent({ data, onAnswer, isReviewMode }: BranchingProps) {
    const [t1Answer, setT1Answer] = useState<string | null>(null);
    const [activeBranch, setActiveBranch] = useState<string | null>(null);
    const { hasSubmitted, submitAnswer } = useBaseQuestion({ onAnswer, isReviewMode });

    const handleT1Select = (option: string) => {
        if (hasSubmitted || isReviewMode) return;
        setT1Answer(option);

        if (option === data.tier1.correctAnswer) {
            // Correct! Finish immediately.
            submitAnswer({ value: option, isCorrect: true, branched: false });
        } else if (data.branches[option]) {
            // Wrong! Trigger the specific branch for this error.
            setActiveBranch(option);
        } else {
            // Wrong but no specific branch defined.
            submitAnswer({ value: option, isCorrect: false, branched: false });
        }
    };

    const handleBranchSelect = (option: string) => {
        if (hasSubmitted || isReviewMode || !activeBranch) return;
        const branchData = data.branches[activeBranch];

        submitAnswer({
            tier1Value: t1Answer,
            branchValue: option,
            isCorrect: false, // Primary answer was still wrong
            branchCorrect: option === branchData.correctAnswer,
            misconceptionHandled: true
        });
    };

    return (
        <BaseTemplateWrapper title="Adaptive Diagnostic" stem={activeBranch ? data.branches[activeBranch].text : data.text}>
            <div className="grid grid-cols-1 gap-3">
                {!activeBranch ? (
                    // Tier 1 Options
                    data.tier1.options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleT1Select(opt)}
                            className="p-5 text-left rounded-2xl border-2 border-app-border hover:border-app-primary bg-app-surface transition-all font-bold"
                        >
                            {opt}
                        </button>
                    ))
                ) : (
                    // Branch Options
                    data.branches[activeBranch].options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleBranchSelect(opt)}
                            disabled={hasSubmitted}
                            className={clsx(
                                "p-5 text-left rounded-2xl border-2 transition-all",
                                hasSubmitted && opt === data.branches[activeBranch].correctAnswer ? "border-app-accent bg-app-accent/10" : "border-app-border"
                            )}
                        >
                            {opt}
                        </button>
                    ))
                )}
            </div>
        </BaseTemplateWrapper>
    );
}
