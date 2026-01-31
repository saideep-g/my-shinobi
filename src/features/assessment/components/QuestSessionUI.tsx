import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@core/engine/SessionContext';
import { getBundleById } from '@features/curriculum/data/bundleRegistry';
import { QuestionRenderer } from '@features/questions/components/QuestionRenderer';
import { MistakeReview } from './MistakeReview';
import { QuestSummary } from './QuestSummary';
import { X, Loader2 } from 'lucide-react';

/**
 * QUEST SESSION UI
 * The fullscreen engine for active subject practice.
 * Manages the transition from Question -> Mistake Review -> Summary.
 */

export const QuestSessionUI: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const [reviewFinished, setReviewFinished] = useState(false);

    const {
        startSession,
        currentQuestion,
        submitResponse,
        isSessionComplete,
        activeBundle
    } = useSession();

    // 1. Initialize session when coming to this route
    useEffect(() => {
        if (subjectId) {
            const bundle = getBundleById(subjectId);
            if (bundle) {
                // Only start if not already in a session for this bundle
                if (activeBundle?.id !== bundle.id || isSessionComplete) {
                    startSession(bundle);
                    setReviewFinished(false);
                }
            } else {
                navigate('/quest');
            }
        }
    }, [subjectId, startSession, navigate]);

    const handleExit = () => navigate('/quest');

    // 2. Flow Control: Completion -> Review -> Summary
    if (isSessionComplete) {
        if (!reviewFinished) {
            return <MistakeReview onComplete={() => setReviewFinished(true)} />;
        }
        return <QuestSummary onAction={handleExit} />;
    }

    // 3. Loading State
    if (!currentQuestion || !activeBundle) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-app-bg animate-in fade-in duration-500">
                <Loader2 className="w-12 h-12 text-app-primary animate-spin" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Awakening the engine...</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-app-bg flex flex-col animate-in slide-in-from-bottom duration-500">
            {/* Minimalist Session Header */}
            <header className="p-4 bg-app-surface/50 backdrop-blur-md border-b border-app-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-app-primary flex items-center justify-center text-white">
                        <span className="text-xs font-black">?</span>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-text-main">{activeBundle.curriculum.name}</h2>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Active Quest</p>
                    </div>
                </div>
                <button
                    onClick={handleExit}
                    className="p-2 hover:bg-app-bg rounded-xl text-text-muted transition-colors"
                >
                    <X size={20} />
                </button>
            </header>

            {/* Questions Container */}
            <main className="flex-1 overflow-y-auto p-4 md:p-10">
                <div className="max-w-2xl mx-auto">
                    <QuestionRenderer
                        question={currentQuestion}
                        data={currentQuestion.data}
                        onAnswer={(ans, dur) => submitResponse(ans.isCorrect, dur)}
                    />
                </div>
            </main>
        </div>
    );
};
