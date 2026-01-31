import React from 'react';
import { Trash2, Edit3, Fingerprint } from 'lucide-react';

/**
 * QUESTION GRID
 * A tabular view of all questions within the subject bundle.
 * Allows for quick review and administrative actions.
 */

export const QuestionGrid: React.FC = () => {
    // Mock data representing the current pool of questions
    const questions = [
        { id: 'q-eng-001', text: "The Sun ___ in the East.", type: "MCQ", hash: "abc123456789" },
        { id: 'q-eng-002', text: "I ___ learning English now.", type: "Sorting", hash: "xyz789012345" },
        { id: 'q-eng-003', text: "Identify the tense: 'He has been reading.'", type: "MCQ", hash: "def456789012" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-black text-text-main">Question Pool ({questions.length})</h4>
                <button className="text-app-primary font-black text-sm hover:underline p-2 rounded-lg hover:bg-app-primary/5 transition-all">
                    + Add Manually
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {questions.map((q) => (
                    <div
                        key={q.id}
                        className="flex items-center justify-between p-5 bg-app-bg border border-app-border rounded-2xl hover:border-app-primary hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center gap-6">
                            {/* Question Type Batch */}
                            <div className="w-12 h-12 rounded-xl bg-app-surface border border-app-border flex items-center justify-center text-[10px] font-black text-text-muted uppercase shadow-inner">
                                {q.type}
                            </div>
                            <div>
                                <p className="font-bold text-text-main">{q.text}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Fingerprint size={12} className="text-app-primary/50" />
                                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{q.hash}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button title="Edit Question" className="p-2.5 hover:bg-app-primary/10 text-app-primary rounded-xl transition-colors border border-transparent hover:border-app-primary/20">
                                <Edit3 size={18} />
                            </button>
                            <button title="Delete Question" className="p-2.5 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors border border-transparent hover:border-rose-100">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
