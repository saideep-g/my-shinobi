import React, { useState } from 'react';
import { QuestionBase } from '@/types/questions';
import { QuestionRenderer } from '@features/questions/components/QuestionRenderer';
import { Smartphone, Layout, X, Zap, Book } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * STUDENT-MIRROR SIMULATOR
 * Renders questions using production components to ensure 100% parity.
 * Includes a "Mobile Quest" and "Student Era" toggle.
 */

interface Props {
    question: QuestionBase;
    onClose?: () => void;
}

export const QuestionSimulator: React.FC<Props> = ({ question, onClose }) => {
    const [viewMode, setViewMode] = useState<'QUEST' | 'ERA'>('QUEST');

    // Muted answer handler for preview mode
    const handleAnswer = (ans: any, dur: number, pts?: number) => {
        console.log("[Simulator] Caught answer:", { ans, dur, pts });
    };

    return (
        <div className="flex flex-col h-full bg-app-bg border-l border-app-border animate-in slide-in-from-right duration-500 overflow-hidden">
            {/* 1. Header with Mode Toggle */}
            <header className="p-6 bg-app-surface border-b border-app-border flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h5 className="text-sm font-black uppercase tracking-widest text-text-main flex items-center gap-2">
                        <Smartphone size={16} className="text-app-primary" /> Simulator
                    </h5>
                    {onClose && (
                        <button onClick={onClose} className="p-1 hover:bg-app-bg rounded-lg text-text-muted">
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className="bg-app-bg p-1 rounded-2xl border border-app-border flex">
                    <button
                        onClick={() => setViewMode('QUEST')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            viewMode === 'QUEST' ? "bg-app-primary text-white shadow-lg shadow-app-primary/20" : "text-text-muted hover:text-text-main"
                        )}
                    >
                        <Zap size={14} /> Mobile Quest
                    </button>
                    <button
                        onClick={() => setViewMode('ERA')}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            viewMode === 'ERA' ? "bg-app-primary text-white shadow-lg shadow-app-primary/20" : "text-text-muted hover:text-text-main"
                        )}
                    >
                        <Book size={14} /> Student Era
                    </button>
                </div>
            </header>

            {/* 2. Device Frame Container */}
            <div className="flex-1 overflow-y-auto p-10 flex justify-center items-center bg-dots-pattern">
                {/* 390 x 844 is standard iPhone 12/13/14 screen size */}
                <div className="relative w-[390px] h-[844px] bg-app-bg rounded-[60px] border-[12px] border-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col scale-[0.7] transform-gpu">
                    {/* Device Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-900 rounded-b-3xl z-50" />

                    {/* Mode Specific Wrappers */}
                    {viewMode === 'QUEST' ? (
                        <div className="flex-1 flex flex-col h-full">
                            {/* Quest Header Mini-Bar */}
                            <div className="p-4 pt-12 bg-app-surface border-b border-app-border flex justify-between items-center">
                                <div className="h-2 w-32 bg-app-border rounded-full overflow-hidden">
                                    <div className="h-full bg-app-primary w-1/3" />
                                </div>
                                <span className="text-[10px] font-black text-text-muted">3/10</span>
                            </div>

                            <main className="flex-1 p-6 overflow-y-auto">
                                <QuestionRenderer
                                    question={question}
                                    data={question.data}
                                    onAnswer={handleAnswer}
                                    isPreview={true}
                                />
                            </main>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950">
                            {/* Era Header Mini-Bar - Focused, Clean */}
                            <div className="p-6 pt-12 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
                                <div className="space-y-1">
                                    <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                    <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                                </div>
                            </div>

                            <main className="flex-1 p-8 overflow-y-auto">
                                <div className="prose prose-sm dark:prose-invert">
                                    <QuestionRenderer
                                        question={question}
                                        data={question.data}
                                        onAnswer={handleAnswer}
                                        isPreview={true}
                                    />
                                </div>
                            </main>
                        </div>
                    )}

                    {/* Device Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/10 rounded-full" />
                </div>
            </div>

            {/* 3. Status Bar */}
            <footer className="p-4 bg-app-surface border-t border-app-border">
                <p className="text-[10px] font-black text-text-muted uppercase text-center tracking-tighter">
                    Parity Verification Engine v4.0 • Student-Mirror
                </p>
            </footer>
        </div>
    );
};
