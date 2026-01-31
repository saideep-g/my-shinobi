import React, { useMemo } from 'react';
import { questionRegistry } from '../registry';
import { QuestionBase } from '@/types/questions';

/**
 * DYNAMIC QUESTION RENDERER
 * The entry point for rendering any question in My-Shinobi.
 * * It resolves the correct versioned component from the registry.
 * * Uses React.lazy/Suspense in future phases to ensure we only load 
 * the code for templates actually being used.
 */

interface RendererProps {
    question: QuestionBase;
    data: any; // The actual content (text, options, etc.)
    onAnswer: (answer: any) => void;
    isReviewMode?: boolean;
}

export const QuestionRenderer: React.FC<RendererProps> = ({
    question,
    data,
    onAnswer,
    isReviewMode = false
}) => {
    // 1. Look up the manifest in the registry
    const manifest = useMemo(() => {
        return questionRegistry.get(question.templateId, question.version);
    }, [question.templateId, question.version]);

    if (!manifest) {
        return (
            <div className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-400">
                <p className="font-bold">Template Error</p>
                <p className="text-xs font-mono">No registry entry for [{question.templateId}] version {question.version}</p>
            </div>
        );
    }

    // 2. In a future phase (Ph 14), we will implement the dynamic component loading here.
    // For now, we render a placeholder to verify the registry works.
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-app-primary/10 text-app-primary text-[10px] font-black rounded uppercase tracking-widest">
                    {manifest.id} v{manifest.version}
                </span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    {manifest.name}
                </span>
            </div>

            <div className="p-8 bg-app-surface border border-app-border rounded-[32px] shadow-sm hover:shadow-md transition-shadow duration-300">
                <p className="text-xl font-bold mb-8 leading-tight text-text-main">
                    {data.text || "Initializing question scroll..."}
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => onAnswer && onAnswer(null)}
                        className="w-full p-6 bg-app-bg/50 border border-app-border border-dashed rounded-2xl text-center hover:bg-app-bg transition-colors"
                    >
                        <div className="text-3xl mb-2">⚡</div>
                        <p className="text-sm font-bold text-text-muted italic">
                            Registry hit! Standing by for {manifest.id} component...
                        </p>
                    </button>

                    {isReviewMode && (
                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Review Insight Enabled</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
