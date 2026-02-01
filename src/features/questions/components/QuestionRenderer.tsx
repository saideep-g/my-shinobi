import React, { useMemo, Suspense, lazy } from 'react';
import { questionRegistry } from '../registry';
import { QuestionBase } from '@/types/questions';

/**
 * UPDATED DYNAMIC QUESTION RENDERER
 * * Now implements lazy-loading for versioned components.
 * * Orchestrates the hand-off between the Registry and the UI.
 */

// We assume a standard file structure for lazy loading:
// @features/questions/types/[templateId]/v[version]/Component.tsx
const loadComponent = (templateId: string, version: number) => {
    return lazy(() => import(`../types/${templateId}/v${version}/Component.tsx`));
};

interface RendererProps {
    question: QuestionBase;
    data: any;
    onAnswer: (answer: any, duration: number, timeTakenMs?: number) => void;
    isReviewMode?: boolean;
}

export const QuestionRenderer: React.FC<RendererProps> = ({
    question,
    data,
    onAnswer,
    isReviewMode = false
}) => {
    const manifest = useMemo(() => {
        return questionRegistry.get(question.templateId, question.version);
    }, [question.templateId, question.version]);

    // Lazy load the component based on the registry path
    const DynamicComponent = useMemo(() => {
        if (!manifest) return null;
        return loadComponent(question.templateId, question.version);
    }, [manifest, question.templateId, question.version]);

    if (!manifest || !DynamicComponent) {
        return (
            <div className="p-10 text-center bg-rose-50 dark:bg-rose-950/20 rounded-[32px] border-2 border-dashed border-rose-200 dark:border-rose-900/50">
                <p className="font-bold text-rose-600 dark:text-rose-400 leading-tight">
                    Template "{question.templateId} v{question.version}" not found.
                </p>
                <p className="text-xs text-rose-500 mt-2">Check the registry and file structure.</p>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-app-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-app-primary/20" />
                <p className="text-xs font-black text-app-primary uppercase tracking-[0.2em] animate-pulse">Initializing Scroll</p>
            </div>
        }>
            <DynamicComponent
                data={data}
                atomId={question.atomId}
                onAnswer={onAnswer}
                isReviewMode={isReviewMode}
            />
        </Suspense>
    );
};
