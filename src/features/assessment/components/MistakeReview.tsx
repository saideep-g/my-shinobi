import React, { useState, useEffect } from 'react';
import { useSession } from '@core/engine/SessionContext';
import { QuestionRenderer } from '@features/questions/components/QuestionRenderer';
import { ArrowRight, ArrowLeft, Lightbulb, CheckCircle, X } from 'lucide-react';
import { dbAdapter } from '@core/database/adapter';
import { AssessmentSession } from '@/types/assessment';

/**
 * MISTAKE REVIEW COMPONENT
 * A focused loop that allows students to inspect their errors before the final victory screen.
 * It uses the standard QuestionRenderer in 'review' mode, keeping the UI consistent.
 */

export const MistakeReview: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const { activeBundle, isSessionComplete, activeSessionId } = useSession();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mistakes, setMistakes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Identify "Incorrect" questions from the active session logs
    useEffect(() => {
        const loadMistakes = async () => {
            if (!isSessionComplete || !activeSessionId || !activeBundle) {
                setIsLoading(false);
                return;
            }

            try {
                const session = await dbAdapter.get<AssessmentSession>('sessions', activeSessionId);
                if (session) {
                    // Filter out the logs where the student was incorrect
                    const mistakeIds = session.logs
                        .filter(log => !log.isCorrect)
                        .map(log => log.questionId);

                    // Map these IDs back to the full question objects from the active bundle
                    const mistakeQuestions = activeBundle.questions.filter(q => mistakeIds.includes(q.id));
                    setMistakes(mistakeQuestions);
                }
            } catch (error) {
                console.error("[MistakeReview] Failed to load mistakes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadMistakes();
    }, [isSessionComplete, activeSessionId, activeBundle]);

    // If there are no mistakes, or we're not supposed to be here, auto-complete
    if (!isLoading && mistakes.length === 0) {
        onComplete();
        return null;
    }

    if (isLoading) return null;

    const currentMistake = mistakes[currentIndex];

    return (
        <div className="fixed inset-0 z-[150] bg-app-bg flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl">

            {/* Progress Header */}
            <header className="flex justify-between items-center p-6 border-b border-app-border bg-app-surface">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                        <Lightbulb size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-text-main">Mistake Review</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Waypoint {currentIndex + 1} of {mistakes.length}</p>
                            <div className="h-1 w-20 bg-app-bg rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-rose-500 transition-all duration-500"
                                    style={{ width: `${((currentIndex + 1) / mistakes.length) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onComplete}
                    className="p-3 bg-app-bg text-text-muted hover:text-text-main rounded-2xl border border-app-border transition-all"
                    title="Skip Review"
                >
                    <X size={20} />
                </button>
            </header>

            {/* Review Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-8">

                    {/* Pedagogical Prompt */}
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-[32px] flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
                        <span className="text-2xl">⚡</span>
                        <div>
                            <p className="text-sm font-bold text-rose-900 mb-1">Wisdom is found in reflection.</p>
                            <p className="text-xs font-medium text-rose-800/70 leading-relaxed">
                                Examine the core concept behind this challenge. Understanding why you missed this will unlock your path to the next rank.
                            </p>
                        </div>
                    </div>

                    {/* Static Question Display - Uses the standard renderer in Review Mode */}
                    <div className="bg-app-surface border border-app-border rounded-[40px] p-1 shadow-sm overflow-hidden">
                        <QuestionRenderer
                            question={currentMistake}
                            data={currentMistake.data}
                            onAnswer={() => { }} // Non-interactive
                            isReviewMode={true}
                        />
                    </div>

                    {/* The "Why" - Tailored Explanation */}
                    <div className="p-8 bg-app-surface border-2 border-app-accent/20 rounded-[40px] relative overflow-hidden group hover:border-app-accent/40 transition-colors shadow-sm">
                        <div className="absolute top-0 left-0 w-2 h-full bg-app-accent" />
                        <h4 className="text-[11px] font-black text-app-accent uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <CheckCircle size={16} fill="currentColor" className="text-white bg-app-accent rounded-full" />
                            Master's insight
                        </h4>
                        <p className="text-text-main font-medium leading-relaxed text-lg italic">
                            {(currentMistake.data as any).explanation || "This atom focuses on the fundamental patterns of the English language. Review the structure above to see how the subject and verb must align."}
                        </p>

                        <div className="mt-6 flex items-center gap-3">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-app-bg px-3 py-1 rounded-lg border border-app-border">
                                Topic: {currentMistake.atomId}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <footer className="p-6 bg-app-surface border-t border-app-border flex gap-4 max-w-2xl mx-auto w-full">
                <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="flex-1 py-5 bg-app-bg border border-app-border text-text-muted rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:text-text-main disabled:opacity-30 transition-all"
                >
                    <ArrowLeft size={18} /> Prev
                </button>

                <button
                    onClick={() => {
                        if (currentIndex < mistakes.length - 1) {
                            setCurrentIndex(prev => prev + 1);
                        } else {
                            onComplete();
                        }
                    }}
                    className="flex-[2] py-5 bg-app-primary text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-app-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {currentIndex < mistakes.length - 1 ? (
                        <>Next Concept <ArrowRight size={18} /></>
                    ) : (
                        <>Complete Review <CheckCircle size={18} /></>
                    )}
                </button>
            </footer>
        </div>
    );
};
