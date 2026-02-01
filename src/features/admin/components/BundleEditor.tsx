import React, { useState } from 'react';
import { ChapterList } from './ChapterList';
import { QuestionGrid } from './QuestionGrid';
import { QuestionPreview } from './QuestionPreview';
import { reviewService } from '@/services/db/reviewService';
import { Activity, ShieldAlert, HeartPulse, Search } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * BUNDLE EDITOR
 * Handles the granular editing of a Subject Bundle.
 * Updates: Status-aware health checks and automated flagging.
 */

interface Props {
    mode?: 'curriculum' | 'questions';
}

export const BundleEditor: React.FC<Props> = ({ mode }) => {
    const [internalTab, setInternalTab] = useState<'curriculum' | 'questions'>('curriculum');
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [isHealthCheckActive, setIsHealthCheckActive] = useState(false);
    const activeTab = mode || internalTab;

    const handleFixAnswer = (newAnswer: string) => {
        if (!selectedQuestion) return;

        const updatedQuestion = {
            ...selectedQuestion,
            data: { ...selectedQuestion.data, answer: newAnswer }
        };

        setSelectedQuestion(updatedQuestion);
        console.log(`[BundleEditor] Auto-fixed typo for ${selectedQuestion.id}: ${newAnswer}`);
    };

    const handleFlag = async (question: any) => {
        const bundleId = "eng-bundle-101"; // Mock bundleId
        const reason = "Manual Admin Flag: Requires verification of content accuracy.";
        try {
            await reviewService.flagQuestion(bundleId, question, reason);
            alert("Question has been flagged and added to the Global Review Queue.");
        } catch (error) {
            console.error("Flag error:", error);
        }
    };

    const toggleHealthCheck = () => {
        setIsHealthCheckActive(!isHealthCheckActive);
    };

    return (
        <div className="flex gap-8 h-[calc(100vh-200px)] min-h-[600px] animate-in fade-in duration-700">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                {/* Toolbar */}
                <div className="flex justify-between items-center">
                    {!mode && (
                        <div className="flex gap-1 bg-app-surface p-1 rounded-2xl border border-app-border w-fit shadow-sm">
                            <button
                                onClick={() => {
                                    setInternalTab('curriculum');
                                    setSelectedQuestion(null);
                                }}
                                className={`px-8 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${activeTab === 'curriculum'
                                    ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                                    : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                                    }`}
                            >
                                Curriculum Graph
                            </button>
                            <button
                                onClick={() => setInternalTab('questions')}
                                className={`px-8 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${activeTab === 'questions'
                                    ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                                    : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                                    }`}
                            >
                                Question Bank
                            </button>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <button
                            onClick={toggleHealthCheck}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                isHealthCheckActive
                                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105"
                                    : "bg-app-surface border border-app-border text-text-muted hover:text-text-main"
                            )}
                        >
                            {isHealthCheckActive ? <ShieldAlert size={14} /> : <HeartPulse size={14} />}
                            {isHealthCheckActive ? "Scan Mode Active" : "Run Health Check"}
                        </button>
                    )}
                </div>

                {/* View Switcher Area */}
                <div className="flex-1 bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm overflow-y-auto custom-scrollbar">
                    {activeTab === 'curriculum' ? (
                        <ChapterList />
                    ) : (
                        <QuestionGrid
                            onSelect={setSelectedQuestion}
                            onFlag={handleFlag}
                            selectedId={selectedQuestion?.id}
                            showHealth={isHealthCheckActive}
                        />
                    )}
                </div>
            </div>

            {/* Right Side Pane: Simulator / Editor */}
            {activeTab === 'questions' && (
                <div className="w-[450px] bg-app-surface border border-app-border rounded-[40px] shadow-sm overflow-hidden flex flex-col">
                    {selectedQuestion ? (
                        <QuestionPreview question={selectedQuestion} onFixAnswer={handleFixAnswer} />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-app-bg border border-app-border rounded-2xl flex items-center justify-center text-text-muted opacity-30">
                                <Search size={32} />
                            </div>
                            <div>
                                <h5 className="font-black text-lg">No Selection</h5>
                                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                                    Select a question from the grid to open the live simulator and integrity checks.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
